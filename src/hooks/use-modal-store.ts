import { create } from "zustand";
import { Space, ChannelType, Channel, Member, Profile } from "@prisma/client";

export type ModalType = "createSpace" | "invite" | "editSpace" | "members" | "createChannel" | "deleteSpace" | "leaveSpace" | "editChannel" | "deleteChannel" | "messageFile" | "deleteMessage" | "openImageFile";

interface ModalData {
  space?: Space;
  channelType?: ChannelType;
  channel?: Channel; 
  apiURL?: string; 
  query?: Record<string, any>;
  imageFileInfo?: {
    imageURL: string,
    chatType: string, 
    sender: Member & {
      profile: Profile
    },
    currentMemberId: string,
  };
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
