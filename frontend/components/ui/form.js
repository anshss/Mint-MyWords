// import { CounterClockwiseClockIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export const metadata = {
  title: "Playground",
  description: "The OpenAI Playground built using the components.",
};

export default function Form() {
  const [formInput, setFormInput] = useState({
    name: "",
    email: "",
    prompt: "",
  });

  console.log(formInput)
  const [emailSent, setEmailSent] = useState(false);

  async function callScript() {
    setEmailSent(true);
    let obj = {
      name: formInput.name,
      email: formInput.email,
      prompt: formInput.prompt,
    };

    let res = await fetch("https://mint-it.onrender.com/api", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: { "Content-Type": "application/json" },
    });
    console.log(res);
  }
  async function recognize() {
    if (typeof window != undefined) {
      const recognition = new webkitSpeechRecognition();
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        setFormInput(result);
        callScript();
      };

      recognition.start();
    }
  }

  return (
    <>
      <div className="flex h-full flex-col space-y-4">
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
          <div className="">
            <Input
              type="email"
              placeholder="Email"
              required
              onChange={(e) =>
                setFormInput({
                  ...formInput,
                  email: e.target.value,
                })
              }
            />
            <Input
              className="mt-4"
              type="text"
              placeholder="Full Name"
              required
              onChange={(e) =>
                setFormInput({
                  ...formInput,
                  name: e.target.value,
                })
              }
            />
          </div>
          <div className="grid col-span-2">
            <Textarea
              placeholder="Text to be minted."
              className="flex-1 p-4"
              required
              onChange={(e) =>
                setFormInput({
                  ...formInput,
                  prompt: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button onClick={callScript}
            className="relative flex h-11 w-full items-center justify-center px-6
            before:absolute before:inset-0 before:rounded-full before:bg-primary
            before:transition before:duration-300 hover:before:scale-105
            active:duration-75 active:before:scale-95 sm:w-max">
            <span class="relative text-base font-semibold text-white">
              Mint
            </span>
          </button>
        </div>

        {emailSent ? <p>Email Sent! You&apos;ll receive in a minute</p> : null}
      </div>
    </>
  );
}
