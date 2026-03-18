import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { io } from "socket.io-client"

const socket = io("https://studentstudio-1.onrender.com")

function Chat() {

  const { projectId } = useParams()
  const user = JSON.parse(localStorage.getItem("user"))

  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")

  // Load old messages once
  const fetchMessages = async () => {
    const res = await fetch(
      `https://studentstudio-1.onrender.com/api/chat/${projectId}`
    )
    const data = await res.json()
    setMessages(data)
  }

  useEffect(() => {

    fetchMessages()

    // Join project room
    socket.emit("joinProject", projectId)

    // Listen for new messages
    socket.on("receiveMessage", (newMessage) => {
      setMessages(prev => [...prev, newMessage])
    })

    return () => {
      socket.off("receiveMessage")
    }

  }, [projectId])

  const sendMessage = () => {

    if (!text.trim()) return

    socket.emit("sendMessage", {
      projectId,
      senderEmail: user.email,
      message: text
    })

    setText("")
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2>Project Chat</h2>

      <div style={styles.chatBox}>
        {messages.map(msg => (
          <div
            key={msg._id || Math.random()}
            style={{
              textAlign:
                msg.senderEmail === user.email
                  ? "right"
                  : "left"
            }}
          >
            <p
              style={{
                ...styles.message,
                background:
                  msg.senderEmail === user.email
                    ? "#00adb5"
                    : "#777"
              }}
            >
              {msg.message}
            </p>
          </div>
        ))}
      </div>

      <div style={styles.inputArea}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type message..."
          style={styles.input}
        />
        <button onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  )
}

const styles = {
  chatBox: {
    border: "1px solid #ccc",
    padding: "20px",
    height: "400px",
    overflowY: "scroll",
    marginBottom: "20px",
    borderRadius: "10px",
    background: "#f9f9f9"
  },
  message: {
    display: "inline-block",
    color: "white",
    padding: "8px 12px",
    borderRadius: "12px",
    marginBottom: "10px",
    maxWidth: "70%"
  },
  inputArea: {
    display: "flex",
    gap: "10px"
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  }
}

export default Chat
