import {useEffect , useState} from 'react'
import {Route , Routes , useNavigate} from 'react-router-dom'
import axios from 'axios'

export default function HomePage() {

    const navigation = useNavigate() 
    const [username , setUsername] = useState('')
    const [loading , setLoading] = useState(true)

    useEffect(()=>{
	axios.post('http://localhost:5000/home' , {},{withCredentials : true})
	.then(response => {
		setLoading(false)
		setUsername(response.data.fullName)
		console.log(response.data)
	    })
	.catch(err => {
		console.log(err)
		navigation('/login')
	    })
	
    } , [])

    return (
    <div>
	    <h1>{(loading) ? 'Loading...' : `Hi ${username} , welcome to dashboard`}</h1>
	<Routes>
		
	</Routes>	 
    </div>
    )
}
