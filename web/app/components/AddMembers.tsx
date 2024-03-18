import React, { useState } from "react";

import { abi } from "../Swoosh.json";
import { IoPersonAdd } from "react-icons/io5";
import { Address } from "viem";
import Input from "./Input";
import { useAddress } from "@thirdweb-dev/react";

interface AddMembersProps {
  members: Address[];
  setMembers: Function;
}

const AddMembers: React.FC<AddMembersProps> = ({ members, setMembers }) => {
  const [addressToAdd, setAddressToAdd] = useState("");
  const user_address = useAddress();
  const [showFailToast, setShowFailToast] = useState(false);
  const addedMembers: string[] = [];

  const addMember = () => {
    //type check to make sure the address is valid (starts with 0x and is 42 characters long)
    if (
      addressToAdd.length !== 42 ||
      !addressToAdd.startsWith("0x") ||
      addressToAdd === user_address
    ) {
      setShowFailToast(true);
      setTimeout(() => {
        setShowFailToast(false); // Hide success message after 3 seconds
      }, 3000);
      return;
    }

    setMembers([...members, addressToAdd]);
    setAddressToAdd("");
    var dialog = document.getElementById(
      "add_member_modal"
    ) as HTMLDialogElement;
    if (dialog) dialog.close();
    // todo: react toast and error handling
    // document.getElementById('input-id').value = '';
  };

  const removeMember = (index: number) => {
    console.log("removing", index);
    // Create a copy of the members array
    const updatedMembers = [...members];
    // Remove the element at the specified index from the copy
    updatedMembers.splice(index, 1);
    // Update the state with the modified copy
    setMembers(updatedMembers);
  };

  const showAddMemberModal = () => {
    var dialog = document.getElementById(
      "add_member_modal"
    ) as HTMLDialogElement;
    if (dialog) dialog.showModal();
  };

  return (
    <div className="pt-4 max-h-[264px] lg:max-h-[84px] overflow-y-auto">
      {showFailToast && (
        <div className="toast toast-top toast-center z-20">
          <div role="alert" className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Invalid address!</span>
          </div>
        </div>
      )}
      <label className="block text-2xl text-blue-900 font-bold mb-2">
        Members:
      </label>
      {members.map((member, index) => {
        return (
          <div
            key={index}
            className="w-7/8 bg-white rounded-full outline my-2 ml-1 mr-1 p-2 font-semibold truncate hover:bg-rose-200 transition"
            onClick={() => removeMember(index)}
          >
            {member}
          </div>
        );
      })}
      <div className="w-full flex justify-center mt-4">
        <div className=" bg-slate-200 p-3 rounded-full">
          <IoPersonAdd
            onClick={() => showAddMemberModal()}
            className="cursor-pointer text-3xl "
          />
        </div>
      </div>

      <dialog id="add_member_modal" className="modal">
        <div className="modal-box">
          <div className="modal-action">
            <form method="dialog" className="space-y-5">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <div className="flex flex-col w-full">
              <Input
                title="Address:"
                placeholder="0x..."
                state={addressToAdd}
                setState={setAddressToAdd}
              />
              <button
                className="btn my-5 btn-success text-lg"
                onClick={addMember}
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default AddMembers;
