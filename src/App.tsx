import { useEffect, useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Textarea } from "./components/ui/textarea";
import { Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";

const messages = [
  {
    question: "Quack! Can you describe your problem in more detail?",
    followUp: "Great! Now, let's break it down. What's the first specific issue you're facing?"
  },
  {
    question: "Interesting! What have you tried so far to solve this?",
    followUp: "Okay, and what was the result of that attempt?"
  },
  {
    question: "Hmm, let's think about the root cause. What do you think might be causing this issue?",
    followUp: "That's a good insight. How can we verify if this is indeed the cause?"
  },
  {
    question: "Let's consider alternatives. Can you think of any other approaches to solve this?",
    followUp: "Excellent thinking! Which of these approaches seems most promising to you?"
  },
  {
    question: "Now, let's plan our next steps. What's the first thing you're going to try based on our discussion?",
    followUp: "Sounds like a plan! Is there anything else you need to consider before trying this?"
  },
  {
    question: "You've made great progress in breaking down the problem. Do you feel closer to a solution now?",
    followUp: "Fantastic! Remember, problem-solving is a process. Take it step by step, and don't hesitate to come back if you need more quacks of wisdom!"
  }
]

function App() {

  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const [counter, setCounter] = useState<number>(0);
  const [status, setStatus] = useState<boolean>(false);

  useEffect(() => {
    const duckAvailability = localStorage.getItem("DuckAvailability");
    if (duckAvailability === "true") {
      setStatus(true);
    }
  }, [isLoading]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  }

  const mimicPromise = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setInput('');
        setIsLoading(false);
        resolve(1);
      }, 1000);
    });
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    if (input.trim() === '') {
      toast.error("Message must not be empty");
      return;
    }

    const lowerCaseText = input.trim().toLowerCase();

    if (lowerCaseText.includes('thanks') || lowerCaseText.includes('thank you')) {
      localStorage.setItem("DuckAvailability", "true");
      return;
    }

    
    await toast.promise(
      mimicPromise(),
      {
        loading: 'Contacting Smart Assistant...',
        success: <b>Success</b>,
        error: <b>Error</b>,
      }
    );
    if (counter >= 5) setCounter(0); // limit of 6 messages
    if (counter % 2 == 0) {
      setResponse(messages[counter].question);
      setCounter(counter + 1);
    }
    else {
      setResponse(messages[counter].followUp);
      setCounter(counter + 1);
    }
  }


  return (
    <div className="bg-slate-100 min-h-screen w-full flex flex-col items-center justify-center p-4">
      <Toaster />


      {!status ? (<Card className="w-full max-w-md mt-4 select-none">
        <CardHeader>
          <CardTitle className=" text-center text-3xl">
            Rubber Duck-e
          </CardTitle>
          <CardDescription className="py-4">
            This is a rubber duck
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Rubber ducks are common household pets. They are small, colorful birds that are known for their ability to answer questions. In this case, we're using a rubber duck to act as a "rubber duck" for a software development project.
          </p>
          <p>
            Please let me know if you have any questions or need assistance!
          </p>
          <Textarea className="min-h-[60px]"
            placeholder="Write your question..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Button className="w-full flex gap-2" onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="animate-spin" size={16} />}Send Message
          </Button>
          <AnimatePresence>
            {response && (
              <div className="border-2 border-slate-200 rounded-lg px-4 py-2 pb-6">
                <motion.div
                  key={response}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <TypeAnimation
                    sequence={[response]}
                    wrapper="p"
                    speed={50}
                    className="italic mt-4 text-slate-700"
                  />
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>) :
        (
          <div>
            Duck is unavailable
          </div>
        )
      }
    </div>
  );
}

export default App;
