import {useState, useEffect} from 'react';
import computerVision from './image-tagging';

const App = () => {
  const [value, setValue] = useState(null);
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);

  //for options
  // const [api, setAPI] = useState("initialState");

  // //for file upload
  // const [file, setFile] = useState(null);


  const createNewChat = () => {
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue("");
  }

  const getMessages = async () => {
    const tags = await computerVision(value);

    const gpt_input = `Only use items in this list that are food and return a recipe with step-by-step instructionsthat use those ingredients: ${tags}`;

    const options = {
      method: "POST",
      body: JSON.stringify({
        message: gpt_input,
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }

    try{
      const response = await fetch('http://localhost:8000/completions', options);
      const data = await response.json();
      setMessage(data.choices[0].message);
    } catch(error){
      console.error(error);
    }
  }

  useEffect(() => {
    console.log(currentTitle, value, message);
    if(!currentTitle && value &&  message){
      setCurrentTitle(value);
    }
    if(currentTitle && value && message){
      setPreviousChats(prevChatts => (
        [...prevChatts, 
          // {
          //   title: currentTitle,
          //   role: "user",
          //   content: value
          // }, 
          {
            title: currentTitle,
            role: message.role,
            content: message.content
          }
        ]
      ))
    }
  }, [message, currentTitle, value])

  console.log(previousChats);

  const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle);
  
  /* get unique items from an object */ 
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)));
  console.log(uniqueTitles);

  return (
    <div className="App">
      <section className = "side-bar">
        <button onClick={createNewChat}>+ New chat</button>
        <ul className = "history">
          {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
        <nav>
          <p>Made by Natalie</p>
        </nav>
      </section>
      <section className = "main-section">
        {/* {!currentTitle && <h1>RecipeGPT</h1>} */}
        <img src='/recipe-gpt-logo.png' alt="recipe-gpt logo"/>
        <p>Submit a photo of your fridge/pantry</p>
        <ul className = "feed">
          {currentChat.map((chatMessage, index) => <li key={index}>
            <p className="role">{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
          </li>)}
        </ul>
        <div className = "bottom-section">
          <div className = "input-container">
            <input value={value} placeholder="Enter url of photo" onChange={(e) => setValue(e.target.value)}/>
            {/* <div id = "submit" onClick={getMessages}>➤</div> */}
            {/* <input type="file" name="file" onChange={getMessages} /> */}
            <input className="input-submit" type="submit" value="Cook" onClick={getMessages}/>
          </div>
          <p className = "info">
            Chat GPT Mar 14 API Version. Free Research Preview.
            Our goal is to ease the cooking environment for all users.
            Your feedback will help us improve.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;