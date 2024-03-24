import React, { useState } from 'react';
import { useMutation,useQuery,useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const createUser = async (user)=>{
  return await axios.post("http://localhost:8000/submit",user);


}

const getUsers = async()=>{
  const {data} = await axios.get("http://localhost:8000");
  return data;
}


const App = () => {
  const [user,setUser] = useState({name:"",email:""});
  const queryClient = useQueryClient()
  
   const {data:users} = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  
  })
  
  const {mutate,data,error,reset,status} = useMutation({
    mutationFn:createUser,
    // this onSuccess function will be called when the mutation is successful and for the new dat we will use the data that we get from the server
    onSuccess:(data)=>{
      queryClient.setQueryData(['users'],(oldData)=>{
        return {
      ...oldData,
      users: [...oldData.users, data.data.user], // Ensure this matches the server's response structure
    };
      })
    }
   
  })
 

  const handleChange = (e)=>{
    setUser({...user,[e.target.name]:e.target.value})
  }

  const handleSubmit = (e)=>{
    e.preventDefault();
    mutate(user);
    console.log(data)

  }



  return (
    <>
    {
      status === "pending" && <h1>Loading...</h1>
    }
     <form
      onSubmit={handleSubmit}

     >
       <input type="text" name="name" id="name" placeholder='Enter your name'
              onChange={handleChange}

              value = {user.name}

       />
       
       <input type="email" name="email" id="email" placeholder='Enter your email'
       onChange={handleChange}
       value = {user.email}
       />

       <button
         disabled={status === "pending "}         
       >Submit</button>

       <button
        onClick={()=>reset()}
       >Clear error & data</button>

       
        
    </form>

    {/* {
      data && <div>
        <h1>{data.data.user.name}</h1>
        <h1>{data.data.user.email}</h1>
      </div>
    } */}

    {
      error && <h1>{error.message}</h1>
    }

{
  users?.users && users.users.map((user)=>(
    <div key={user.name}>
      <h1>{user.name}</h1>
      <h1>{user.email}</h1>
    </div>
  
  ))
}

    </>



  )
}

export default App

