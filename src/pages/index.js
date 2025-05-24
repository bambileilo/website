import Head from "next/head"
import {useEffect, useRef, useState} from "react"

export default function Home() {
  const [logs, setLogs] = useState([])
  const [command, setCommand] = useState("help")
  const viewEndRef = useRef(null)
  const inputRef = useRef(null)

  function handleCommand(command) {
    setCommand(command)
  }

  function executeCommand() {
    const currentCommand = command.trim()
    let newLogs = [...logs, { type: 'input', value: currentCommand }]

    switch (currentCommand.toLowerCase()) {
      case "help":
        newLogs = [...newLogs, { type: 'output', value: "Available commands: help, clear, contact, projects, open <project>" }]
        break;
      case "clear":
        newLogs = [];
        break;
      case "contact":
        newLogs = [...newLogs, { type: 'output', value: "Twitter: @bambileilo" }]
        break
      case "projects":
        newLogs = [
          ...newLogs,
          { type: 'output', value: "website - dsł ta stronka" },
          { type: 'output', value: "alexoth - modlimy się żeby @sasha_topg rzuciła palenie" },
        ]
        break;
      case "open website":
        newLogs = [...newLogs, { type: 'output', value: "Opening website..." }]
        window.open("https://bambileilo.com", "_blank")
        break;
      case "open alexoth":
        newLogs = [...newLogs, { type: 'output', value: "Opening Alexoth..." }]
        window.open(location.protocol + '//' + location.host + location.pathname + "/alexoth", "_blank")
        break;
      case "":
        newLogs = [...newLogs, { type: 'output', value: "" }]
        break;
      default:
        if (currentCommand.startsWith("open")) {
          newLogs = [...newLogs, { type: 'output', value: `Unknown project: ` + currentCommand.slice(4) }]
        } else {
          newLogs = [...newLogs, {type: 'output', value: `Command not found: ${currentCommand}`}]
        }
    }

    setLogs(newLogs)
    setCommand("")
    setTimeout(() => {
      if (viewEndRef.current) {
        viewEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    })
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(command.length, command.length)
      inputRef.current.style.width = `${Math.max(1, command.length * 9)}px`
    }
  }, [command])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef])

  return (
    <>
      <Head>
        <title>bambileilo</title>
        <link rel="icon" href="/favicon.ico"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div
        className={`flex w-full min-w-screen min-h-screen h-full bg-[#261621] overflow-x-hidden justify-center sm:justify-start`}
        onClick={() => inputRef.current.focus()}
      >
        <main className={`p-3 sm:p-6 font-roboto-mono text-sm`}>
          <div className={`flex flex-col sm:flex-row`}>
            <div className={`flex justify-center items-end bg-[#688893] w-full sm:w-96 h-96  rounded`}>
              <img
                alt={"avatar"}
                src={"/home/avatar.png"}
                className={`w-3/5 sm:w-72 h-auto max-w-72 max-h-96 hue-rotate-[320deg] `}
              />
            </div>
            <div className={`text-[#d4b8ac] sm:px-6 pt-6 sm:pt-0`}>
              <p className={`font-bold`}>bambileilo@bambileilo.com</p>
              <p className={`py-1`}>-------------------------</p>
              <p><span className={`font-bold`}>OS: </span><span className={`text-[#d7d2cc]`}>Male</span></p>
              <p><span className={`font-bold`}>Host: </span><span className={`text-[#d7d2cc]`}>Poland</span></p>
              <p><span className={`font-bold`}>Port: </span><span className={`text-[#d7d2cc]`}>Warsaw</span></p>
              <p><span className={`font-bold`}>Uptime: </span><span className={`text-[#d7d2cc]`}>Since '99</span></p>
              <p><span className={`font-bold`}>Resolution: </span><span className={`text-[#d7d2cc]`}>178px</span></p>
              <p><span className={`font-bold`}>Package: </span><span className={`text-[#d7d2cc]`}>69</span></p>
              <p><span className={`font-bold`}>Shell: </span><span className={`text-[#d7d2cc]`}>Polish/English</span>
              </p>
              <p><span className={`font-bold`}>Theme: </span><span className={`text-[#d7d2cc]`}>Nerd</span></p>
              <p><span className={`font-bold`}>CPU: </span><span
                className={`text-[#d7d2cc]`}>Software Development</span></p>
              <p><span className={`font-bold`}>GPU: </span><span className={`text-[#d7d2cc]`}>Digital art</span></p>
              <p><span className={`font-bold`}>I/O: </span><span className={`text-[#d7d2cc]`}>Piano</span></p>
              <p><span className={`font-bold`}>Memory: </span><span className={`text-[#d7d2cc]`}>Korean</span></p>
              <p></p>
              <div className={`flex pt-4 pl-8`}>
                <div className={'w-9 h-7 bg-[#ce9178]'}></div>
                <div className={'w-9 h-7 bg-[#6a7786]'}></div>
                <div className={'w-9 h-7 bg-[#698996]'}></div>
                <div className={'w-9 h-7 bg-[#d09d8a]'}></div>
                <div className={'w-9 h-7 bg-[#d5af98]'}></div>
                <div className={'w-9 h-7 bg-[#d8b8ab]'}></div>
                <div className={'w-9 h-7 bg-[#d7d2cc]'}></div>
              </div>
            </div>
          </div>
          <div
            className={`flex flex-col pt-4 pb-2`}
          >
            {logs.map((log, index) => (
              <div key={`log-${index}`} className={`flex flex-wrap`}>
                {log.type === 'input' && <span className={`text-[#6a7786]`}>bambileilo </span>}
                {log.type === 'input' && <span className={`text-[#d5af98] pl-3 pr-2`}> ~/projects &gt; </span>}
                <span className={`text-[#d7d2cc]`}>{log.value}</span>
              </div>
            ))}
            <div className={`flex`}>
              <span className={`text-[#6a7786]`}>bambileilo </span>
              <span className={`text-[#d5af98] pl-3 pr-2`}> ~/projects &gt; </span>
              <input
                ref={inputRef}
                autoFocus={true}
                className={`text-[#d7d2cc] min-w-1 outline-none bg-transparent caret-transparent`}
                onChange={(e) => handleCommand(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    executeCommand()
                  }
                }}
                value={command}
              />
              <div className={`h-5 w-2 bg-[#ce9178] animate-pulse`}>
              </div>
            </div>
          </div>
          <div ref={viewEndRef} className={`h-2 w-full`}>
          </div>
        </main>
      </div>
    </>
  );
}
