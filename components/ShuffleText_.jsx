/*
1. Die Komponente auf der Startseite einsetzen.
2. Verbindet das Input-Element mit einem state "text"
3. Wenn der Text sich ändert, soll der Inhalt des Input-Elements an unsere shuffletext-Schnittstelle 
gesendet werden, der Antwort-Text soll in einem strong-Element
mit der Klasse .big-text angezeigt werden. Nutzt dafür den state "shuffledText"
4. Bonus: Nutzt den Hook useDebouncedValue
*/
import { useState, useEffect } from 'react'
import { useDebouncedValue } from '../hooks/useDebouncedValue'

export default function ShuffleText() {
    const [text, setText] = useState('');
    const [shuffledText, setShuffledText] = useState('');
    const debouncedText = useDebouncedValue(text, 600);

    useEffect(() => {
        async function fetchText() {
            try {
                const response = await fetch(`${window.location.origin}/api/shuffletext/?text=${debouncedText}`)
                if (!response.ok) {
                    throw new Error("error")
                }
                const jsonData = await response.json();
                setShuffledText(jsonData.text)
            } catch (error) {
                console.log(error);
            }
        }
        fetchText()
    }, [debouncedText]);


    // async function fetchText() {
    //     const response = fetch(`/api/shuffletext/?text=${debouncedText}`, {
    //         method: 'post',
    //         body: JSON.stringify({
    //             text: debouncedText,
    //         })
    //     })
    //     // console.log("response:", response)
    //     // .then(res => res.json())
    //     // .then(data => setShuffledText(data))

    //     const jsonData = await response.json();
    //     console.log("jsonData:", jsonData)
    //     // if (jsonData) {
    //     //     setShuffledText(jsonData);
    //     // } else {
    //     //     setShuffledText('')
    //     // }
    // }
    // fetchText()

    return (
        <div>
            <label htmlFor="text">Text</label>
            <br />
            <input type="text" id="text" onChange={(e) => setText(e.target.value)} />
            <strong className='big-text'>{shuffledText}</strong>
        </div>
    )
}
