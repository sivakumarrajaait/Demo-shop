import express from 'express';
import request from 'supertest';
import { sendEmail } from '../../controller/mail.controller';
import { transporter } from '../../config/mailer';
import fs from 'fs';
import handlebars from 'handlebars';


jest.mock('fs');
jest.mock('handlebars');
jest.mock('../../config/mailer', () => ({
  transporter: {
    sendMail: jest.fn()
  }
}));


const app = express();
app.use(express.json());
app.post('/send-email', sendEmail);


const mockedFs = fs as jest.Mocked<typeof fs>;
const mockedHandlebars = handlebars as jest.Mocked<typeof handlebars>;
const mockedSendMail = transporter.sendMail as jest.Mock;


beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('sendEmail controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send email successfully', async () => {
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue('<p>Hello {{name}}</p>');
    mockedHandlebars.compile.mockReturnValue(() => '<p>Hello Siva</p>');
    mockedSendMail.mockResolvedValue({});

    const response = await request(app)
      .post('/send-email')
      .send({
        to: 'skkumar97260@gmail.com',
        subject: 'Test Subject',
        template: 'welcome',
        variables: { name: 'Siva' },
        attachments: ['sample.pdf']
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Email sent successfully.');
    expect(mockedSendMail).toHaveBeenCalledTimes(1);
  });

  it('should return 400 for invalid email', async () => {
    const response = await request(app)
      .post('/send-email')
      .send({ to: 'invalid-email', template: 'welcome' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Valid recipient email is required.');
  });

  it('should return 400 for invalid template name', async () => {
    const response = await request(app)
      .post('/send-email')
      .send({ to: 'skkumar97260@gmail.com', template: 'invalid template!' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid template name.');
  });

  it('should return 404 if template file is not found', async () => {
    mockedFs.existsSync.mockReturnValue(false);

    const response = await request(app)
      .post('/send-email')
      .send({ to: 'skkumar97260@gmail.com', template: 'notfound' });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe(`Template 'notfound.html' not found.`);
  });

  it('should return 500 if sendMail throws an error', async () => {
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue('<p>Hello {{name}}</p>');
    mockedHandlebars.compile.mockReturnValue(() => '<p>Hello Siva</p>');
    mockedSendMail.mockRejectedValue(new Error('SMTP Error'));

    const response = await request(app)
      .post('/send-email')
      .send({
        to: 'skkumar97260@gmail.com',
        subject: 'Test',
        template: 'welcome',
        variables: { name: 'Siva' }
      });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Internal Server Error.');
  });
});
