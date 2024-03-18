'use client';

import React, { useEffect, useState } from 'react';
import Input from 'app/components/Input';
import AddMembers from 'app/components/AddMembers';
import { abi } from '../Swoosh.json';
import { FaPeopleGroup } from 'react-icons/fa6';
import { BsPerson } from 'react-icons/bs';
import { toWei, useAddress, useContract, useContractWrite } from '@thirdweb-dev/react';
import { Address } from '@thirdweb-dev/react';

let axios = require('axios');

const AddPage = () => {
  const [message, setMessage] = useState('');
  const [costStr, setCostStr] = useState('');
  const [members, setMembers] = useState([]);
  const [isRequesting, setIsRequesting] = useState(true);
  const [payAddress, setPayAddress] = useState('');
  const { contract } = useContract(process.env.CONTRACT_ADDRESS);
  const [prevIsLoading, setPrevIsLoading] = useState(false);
  const [prevPayIsLoading, setPrevPayIsLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showAddressErrorToast, setShowAddressErrorToast] = useState(false);
  const [showVerifyToast, setShowVerifyToast] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [threatSummary, setThreatSummary] = useState('');

  const user_address = useAddress();

  let { mutateAsync: requestMutateAsync, isLoading, error } = useContractWrite(contract, 'request');

  let {
    mutateAsync: payMutateAsync,
    isLoading: payIsLoading,
    error: payError,
  } = useContractWrite(contract, 'pay');

  useEffect(() => {
    if (prevIsLoading && !isLoading) {
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 3000);
      resetInputs();
    }
    setPrevIsLoading(isLoading);
  }, [isLoading, prevIsLoading]);

  useEffect(() => {
    if (prevPayIsLoading && !payIsLoading) {
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 3000);
      resetInputs();
    }
    setPrevPayIsLoading(payIsLoading);
  }, [payIsLoading, prevPayIsLoading]);

  async function submit(e: any) {
    if (message.trim() == '' || costStr.trim() == '' || (members.length == 0 && isRequesting)) {
      setShowErrorToast(true);
      setTimeout(() => {
        setShowErrorToast(false);
      }, 3000);
      return;
    }

    if (
      !isRequesting &&
      (payAddress.trim().length !== 42 ||
        !payAddress.trim().startsWith('0x') ||
        payAddress.trim() === user_address)
    ) {
      setShowAddressErrorToast(true);
      setTimeout(() => {
        setShowAddressErrorToast(false);
      }, 3000);
      return;
    }

    var amount = toWei(parseFloat(costStr) / (members.length + 1));

    //todo: add image uri, add error handling
    if (isRequesting) {
      requestMutateAsync({ args: [members, amount, message, ''] });
    } else {
      payMutateAsync({ args: [payAddress, toWei(parseFloat(costStr)), message, ''] });
    }
  }

  const resetInputs = () => {
    setMessage('');
    setCostStr('');
    setMembers([]);
    setPayAddress('');
  };

  const verifyAddress = async () => {
    let data = JSON.stringify({
      address: payAddress,
      apiKey: process.env.HARPIE_API_KEY,
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.harpie.io/v2/validateAddress',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    setVerificationLoading(true);
    axios
      .request(config)
      .then((response: any) => {
        console.log(response.data['summary']);
        setThreatSummary(response.data['summary']);
      })
      .catch((error: any) => {
        console.log(error);
      });
    setVerificationLoading(false);

    setShowVerifyToast(true);
    setTimeout(() => {
      setShowVerifyToast(false);
    }, 3000);
  };
  return (
    <div className="flex max-h-screen flex-col px-4 pb-20">
      <div className="sticky top-0 z-10 mb-1 max-h-screen w-full pb-4">
        <Header title="Make a Swoosh" />
        <div className="flex w-full items-center justify-center space-x-3">
          <FaPeopleGroup className="text-4xl" />
          <input
            type="checkbox"
            className="toggle"
            onChange={(e) => setIsRequesting(!e.target.checked)}
            checked={!isRequesting}
          />
          <BsPerson className="text-3xl" />
        </div>
      </div>
      {isRequesting ? (
        <div className="flex h-full max-h-fit w-full flex-col space-y-5 rounded-lg bg-gray px-4 py-3">
          <h1 className="text-center text-3xl font-bold ">Request</h1>
          <Input title="Message:" placeholder="Groceries" state={message} setState={setMessage} />
          <Input
            title="Total Cost ($):"
            placeholder="10.99"
            state={costStr}
            setState={setCostStr}
          />
          <AddMembers members={members} setMembers={setMembers} />
        </div>
      ) : (
        <div className="flex h-full max-h-fit w-full flex-col space-y-5 rounded-lg bg-gray px-4 py-3">
          <h1 className="text-center text-3xl font-bold ">Pay</h1>
          <Input title="Message:" placeholder="Groceries" state={message} setState={setMessage} />
          <Input
            title="Total Cost ($):"
            placeholder="10.99"
            state={costStr}
            setState={setCostStr}
          />
          <Input
            title="User Address: "
            placeholder="0x..."
            state={payAddress}
            setState={setPayAddress}
          />
        </div>
      )}
      {!isRequesting ? (
        <button
          className="btn mt-4 w-full rounded-full bg-blue-700 text-2xl text-white"
          onClick={() => verifyAddress()}
        >
          {verificationLoading ? 'Verifying...' : 'Verify Address'}
        </button>
      ) : null}
      <button
        className="btn btn-primary mt-4 w-full rounded-full text-2xl text-white outline"
        onClick={submit}
      >
        {isLoading || payIsLoading ? 'Confirming...' : 'Sweesh!'}
      </button>
      {showSuccessToast && (
        <div className="toast toast-center toast-top z-20">
          <div role="alert" className="alert alert-success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Swoosh request successfully sent!</span>
          </div>
        </div>
      )}
      {showAddressErrorToast && (
        <div className="toast toast-center toast-top z-20">
          <div role="alert" className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
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
            <span>Invalid pay address!</span>
          </div>
        </div>
      )}
      {showErrorToast && (
        <div className="toast toast-center toast-top z-20">
          <div role="alert" className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
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
            <span>Swoosh request failed!</span>
          </div>
        </div>
      )}
      {showVerifyToast && (
        <div className="toast toast-center toast-top z-20">
          <div role="alert" className="alert alert-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
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
            <span>{threatSummary}</span>
          </div>
        </div>
      )}

      <p></p>
    </div>
  );
};

export default AddPage;
