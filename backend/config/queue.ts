import Queue from "bull";

export const emailQueue = new Queue("emailQueue", {
    redis: { host: "127.0.0.1", port: 6379 }
});

emailQueue.process(async (job) => {
    console.log("Sending email:", job.data);
    return new Promise((resolve) => setTimeout(resolve, 2000)); 
});
