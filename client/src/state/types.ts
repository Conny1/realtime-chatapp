export type User = {
  name: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  pic: string;
  tokens: string;
  _id: string;
};

export type Messages = {
  sender: User;
  content: string;
  chat: Chats;
  _id: string;
};

export type Chats = {
  chatname: string;
  isgroupchat: boolean;
  users: User[];
  latestmessage: Messages;
  groupadmin: User;
  _id: string;
  timestamp: string | Date;
};
export interface MyApiError {
  response?: {
    status?: number;
  };
}
export interface CustomEvents {
  joinchat: string;
  setup: User;
  // Add more custom events as needed
}
