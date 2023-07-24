import Form from "@/components/ui/form";
import { useState } from "react";

export default function Home() {
  const [formInput, setFormInput] = useState({
    name: "",
    email: "",
    prompt: "",
  });
  const [emailSent, setEmailSent] = useState(false);

  async function callScript() {
    setEmailSent(true);
    let obj = {
      name: formInput.name,
      email: formInput.email,
      prompt: formInput.prompt,
    };

    let res = await fetch("https://alexa-skill-backend.onrender.com/api", {
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
    <div className="bg-white dark:bg-gray-900">
      <div className="space-y-40 mb-40">
        <div class="relative h-" id="home">
          <div
            aria-hidden="true"
            class="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20"
          >
            <div class="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700"></div>
            <div class="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600"></div>
          </div>

          <div class="max-w-7xl mx-auto px-6 md:px-12 xl:px-6">
            <div class="relative pt-36 ml-auto">
              <div class="lg:w-2/3 text-center mx-auto">
                <h1 class="text-gray-900 dark:text-white font-bold text-5xl md:text-6xl xl:text-7xl">
                &rdquo;Mint My Words&rdquo; <br />
                  <span class="text-primary dark:text-white">
                    Alexa Skill <sup> demo</sup>.
                  </span>
                </h1>
                <p class="mt-8 text-gray-700 dark:text-gray-300">
                  Turn Your Words into Art on the Flow Blockchain with Mint My
                  Words. Mint NFTs without the need of wallet in the most user
                  friendly way using your Alexa.
                </p>
                <div class="mt-16 flex flex-wrap justify-center gap-y-4 gap-x-6">
                  <a
                    href="#"
                    class="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
                  >
                    <span class="relative text-base font-semibold text-white">
                      Get started
                    </span>
                  </a>
                  <a
                    href="https://youtu.be/KCG4igYfO_E"
                    target="_blank"
                    class="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:border before:border-transparent before:bg-primary/10 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 dark:before:border-gray-700 dark:before:bg-gray-800 sm:w-max"
                  >
                    <span class="relative text-base font-semibold text-primary dark:text-white">
                      Youtube Demo
                    </span>
                  </a>
                </div>
                {/* <div class="hidden py-8 mt-16 border-y border-gray-100 dark:border-gray-800 sm:flex justify-between">
              
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* <Container> */}
        <div class="max-w-7xl mx-auto px-6 md:px-12 xl:px-6">
          <div class="md:w-2/3 lg:w-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-6 h-6 text-secondary"
            >
              <path
                fill-rule="evenodd"
                d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z"
                clip-rule="evenodd"
              />
            </svg>

            <h2 class="my-8 text-4xl font-bold text-gray-700 dark:text-white md:text-6xl">
              Test out our service
            </h2>
            <p class="text-gray-600 dark:text-gray-300 text-xl">
            Enter your name and email below along with the prompt and hit the mint button and we&apos;ll send you a mail with a beautifully generated image with this prompt minted as a NFT.
            </p>
          </div>
          <div class="mt-16 ">
                <Form />
          </div>
        </div>
        {/* </Container> */}
      </div>
     
      {/* <input
        name="name"
        placeholder="name"
        required
        onChange={(e) =>
          setFormInput({
            ...formInput,
            name: e.target.value,
          })
        }
      />
      <input
        name="email"
        placeholder="email"
        required
        onChange={(e) =>
          setFormInput({
            ...formInput,
            email: e.target.value,
          })
        }
      />
      <input
        name="prompt"
        placeholder="prompt"
        required
        onChange={(e) =>
          setFormInput({
            ...formInput,
            prompt: e.target.value,
          })
        }
      />
      <button onClick={callScript}>Click to direct send</button>
      <button onClick={recognize}>Click to recognize and send</button>
      {emailSent ? <p>Email Sent! You&apos;ll receive in a minute</p> : null} */}
    </div>
  );
}
