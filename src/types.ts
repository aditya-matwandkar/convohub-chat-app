import { NextApiResponse } from "next";
import { Space, Member, Profile, Message } from "@prisma/client";

import { Server as NetServer, Socket } from "net";
import { Server as SocketIOServer } from "socket.io";

export type SpaceWithMembersWithProfiles = Space & {
  members: (Member & {
    profile: Profile;
  })[];
};

export type MessageWithMembersWithProfile = Message & {
  member: (Member & {
    profile: Profile;
  })[];
};

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
