"use client";

import React, { useEffect, useState } from "react";

import CreateSpaceModel from "../modals/create-space-modal";
import InviteModal from "../modals/invite-modal";
import EditSpaceModal from "../modals/edit-space-modal";
import ManageMembersModal from "../modals/manage-members-modal";
import CreateChannelModel from "../modals/create-channel-modal";
import DeleteSpaceModal from "../modals/delete-space-modal";
import LeaveSpaceModal from "../modals/leave-space-modal";
import DeleteChannelModal from "../modals/delete-channel-modal";
import EditChannelModel from "../modals/edit-channel-modal";
import MessageFileModal from "../modals/message-file-model";
import DeleteMessageModal from "../modals/delete-message-modal";
import OpenImageFile from "../modals/open-image-file";

export default function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateSpaceModel />
      <InviteModal />
      <EditSpaceModal />
      <ManageMembersModal />
      <CreateChannelModel />
      <DeleteSpaceModal />
      <LeaveSpaceModal />
      <DeleteChannelModal />
      <EditChannelModel />
      <MessageFileModal />
      <DeleteMessageModal />
      <OpenImageFile />
    </>
  );
}
