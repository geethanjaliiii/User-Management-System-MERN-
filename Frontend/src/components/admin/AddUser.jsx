import React ,{useState}from 'react'
import { ToastContainer,toast } from 'react-toastify'
import axiosInstance from '../../config/axiosConfig'
import { useNavigate } from 'react-router-dom'

const AddUser = () => {
    const[error,setError]=useState({})
    const[formData,setFormData]=useState({
        name:'',
        email:"",
        phone:"",
        password:"",
        confirmPassword:"",
        image:null
    })
    const navigate=useNavigate()

    function handleChange(e){
        setFormData((prev)=>({...prev,[e.target.name]:e.target.value}))
    }

    function handleImageChange(e){
        setFormData({...formData,image:e.target.files[0]})
    }

    function validateForm(){
        const newError={}
        if(!formData.name.trim()){
            newError.name="Name is required"
        }else if(!/^[a-zA-Z\s]+$/.test(formData.name)){
            newError.name="Name must only contain letters"
        }else if(formData.name.length<2){
            newError.name="Name must contain atleast two letters"
        }

        //email Validation
        if(!formData.email.trim()){
            newError.email="Email is required"
        }else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)){
            newError.email="Invalid email format"
        }

        //phone validation
        if(!formData.phone.trim()){
            newError.phone="Phone number is required"
        }else if(!/^\d{10}$/.test(formData.phone)){
            newError.phone="Phone number should contain 10 digits"
        }

        //password validation
        if(!formData.password.trim()){
            newError.password="Password is required"
        }else if (formData.password.length < 9) {
            newError.password = "Password must be atleast 8 characters";
          } else if (!/[A-Z]/.test(formData.password)) {
            newError.password = "Password must contain atleast one Uppercase letter";
          } else if (!/\d/.test(formData.password)) {
            newError.password = "Password must contain atleast one number";
          } else if (!/[!@#$%^&*]/.test(formData.password)) {
            newError.password = "Password must contain special character";
          }

          if(!formData.confirmPassword.trim()){
            newError.password="Field is empty"
          }else if(formData.password!=formData.confirmPassword){
            newError.confirmPassword="Password Mismatch!"
          }

          if(!formData.image){
            newError.image="Image is required"
          }else if(!["image/jpeg","image/png"].includes(formData.image.type)){
            newError.image="Invalid image format"
          }

          setError(newError)
          return Object.keys(newError).length===0
    }
    


   async function handleSubmit(e){
        e.preventDefault()
        if(validateForm()){
            console.log("form is valid",formData);
            try {
              //form data object is neccessary to upload multipart form data 
              //uploading states directly throw errors
              const data=new FormData()
              data.append("name",formData.name)
              data.append("email",formData.email)
              data.append("phone",formData.phone)
              data.append("password",formData.password)
              data.append("confirmPassword",formData.confirmPassword)
              data.append("image",formData.image)
                const response= await axiosInstance.post('/api/users/admin/addUser',data, {
                    header: {
                      "Content-Type": "multipart/form-data",
                    },
                  })  
                  if(response){
                    console.log(response.data);
                    toast.success("User added suucessfully")
                    setTimeout(()=>{
                     navigate('/admin/dashboard')
                    },500)
                  }
            } catch (error) {
                console.log(error.message);
                toast.error("User register failed!")
            }
          

        }else{
        console.log("form invalid");
        
        }
    }
    //to add use i need a form 
   //a form dara state
   //post req to handle submit 
   

  return (
    <div className="flex justify-center items-center min-h-screen bg-black/80  ">
    <div className="max-w-md mx-auto mt-5 px-10 py-2 space-y-3 bg-gradient-to-r bg-white/20 shadow-lg backdrop-blur-lg   rounded-lg">
      <h1 className="text-2xl font-bold text-center text-white ">Add user</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        encType="multipart/form-data"
      >
        <div className="flex flex-col space-y-0.5">
          <label htmlFor="name" className="text-white/80 block">
            Name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            name="name"
            className="w-full px-3 py-1 rounded-md bg-gray-200"
            placeholder="Enter your name.."
          />
          {error && <span className="text-red-300">{error.name}</span>}
        </div>

        <div className="flex flex-col space-y-0.5">
          <label htmlFor="email" className="text-white/80 block">
            Email
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            name="email"
            placeholder="Enter you email"
            className="w-full px-3 py-1 rounded-md bg-gray-200"
          />
          {error && <span className="text-red-300">{error.email}</span>}
        </div>

        <div className="flex flex-col space-y-0.5">
          <label htmlFor="phone" className="text-white/80 block">
            Phone
          </label>
          <input
            type="number"
            required
            value={formData.phone}
            onChange={handleChange}
            name="phone"
            placeholder="Enter you number"
            className="w-full px-3 py-1 rounded-md bg-gray-200"
          />
          {error && <span className="text-red-300">{error.phone}</span>}
        </div>

        <div className="flex flex-col space-y-0.5">
          <label htmlFor="password" className="text-white/80 block">
            Password
          </label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            name="password"
            placeholder="Enter password"
            className="w-full px-3 py-1 rounded-md bg-gray-200"
          />
          {error && <span className="text-red-300">{error.password}</span>}
        </div>

        <div className="flex flex-col space-y-0.5">
          <label htmlFor="confirmPassword" className="text-white/80 block">
            Confirm Password
          </label>
          <input
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            name="confirmPassword"
            placeholder="Confirm password"
            className="w-full px-3 py-1 rounded-md bg-gray-200"
          />
          {error && (
            <span className="text-red-300">{error.confirmPassword}</span>
          )}
        </div>

        <div className="flex flex-col space-y-0.5">
          <label htmlFor="image" className="text-white/80 block">
            Upload Image
          </label>
          <input
            type="file"
            required
            name="image"
            onChange={handleImageChange}
            className="w-full py-1 rounded-md  text-white "
          />
          {error && <span className="text-red-300">{error.image}</span>}
        </div>

        <div className="flex justify-center items-center flex-col gap-0.5">
          <button
            type="submit"
            className="w-3/5 bg-pink-500 hover:bg-purple-950 text-white py-1 px-4 rounded-md transition duration-300"
          >
            ADD
          </button>
          <button
            type="button"
            className="w-3/5 hover:bg-purple-950  text-white py-1 px-4 rounded-md transition duration-300"
            onClick={() => {
              navigate("/admin/dashboard");
            }}
          >
            Cancel
          </button>
          {error && <span className="text-red-300">{error.server}</span>}
        </div>
      </form>
    </div>
    <ToastContainer />
  </div>
  )
}

export default AddUser
