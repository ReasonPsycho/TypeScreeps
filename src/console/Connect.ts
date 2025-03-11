import SockJS from "sockjs-client";
import WebSocket, { Event, MessageEvent } from "ws";
import fetch from "node-fetch";
import { execSync } from "child_process";

interface UserInfo {
  _id: string;
  badge: {
    type: number;
    color1: number;
    color2: number;
    color3: number;
    param: number;
    flip: boolean;
  };
  cpu: number;
  credits: number;
  email: string;
  gcl: number;
  github: {
    id: string;
    username: string;
  };
  lastChargeTime: number;
  notifyPrefs: {
    errorsInterval: number;
    sendOnline: boolean;
  };
  ok: number;
  password: boolean;
  username: string;
}

interface IAPIOptions {
  method: string;
  headers: {
    "X-Token": string;
    "X-Username": string;
  };
}

const url = "https://screeps.com/api/auth/me";

const apiToken = execSync(`op item get Screeps --vault password --field Screeps`, { encoding: "utf-8" }).trim();
const options: IAPIOptions = {
  method: "GET",
  headers: {
    "X-Token": apiToken,
    "X-Username": "_Reasonable_Psycho_"
  }
};
async function getUserInfo() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
    const response = await fetch(url, options);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const data = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

getUserInfo()
  .then(data => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    // const userId = userInfo.data._id;

    // Just a precaution, check if the SockJS exists before creating a new instance
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const socket: WebSocket = new SockJS("https://screeps.com/socket/");
    let connected = false;

    socket.onopen = (): void => {
      console.log("open");
      socket.send(`auth ${apiToken}`);
    };

    // Handles messages from the server
    socket.onmessage = (e: MessageEvent): void => {
      const message: any = e.data;
      // Check if the message is an indication of successful authentication
      // Make sure to adjust this condition to match your server's confirmation message
      if (message === `auth ok ${apiToken}`) {
        console.log("Authenticated! Now subscribing to the data stream.");
        socket.send(`subscribe ${"user:59f5f6a85b3b0f302735d44a/console"}`);
        connected = true;
      }

      console.log(JSON.stringify(message));
    };

    // Error handling
    socket.onerror = (error: Event): void => {
      console.log("A connection error occurred: ", error);
    };

    // The rest of your WebSocket handling code goes here...
  })
  .catch(error => {
    console.error("An error occurred:", error);
  });
