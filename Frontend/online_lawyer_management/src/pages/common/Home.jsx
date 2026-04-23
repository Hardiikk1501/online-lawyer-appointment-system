import React,{useState}from 'react';  
import {useNavigate} from 'react-router-dom';
import "../../assets/STYLES/Home.css";

function Home() {
  const [specialization, setSpecialization] = useState('');
  const navigate = useNavigate();

   const handleSearch = () => {
    if (specialization) {
     // alert(`Searching for lawyers specializing in ${specialization}`);
     navigate(`/lawyers?specialization=${encodeURIComponent(specialization)}`);
    }
    else {      alert('Please select a specialization');
    }
  };
  return (
    <div className='home-container'>
   {/* navbar */}

    {/* hero section */}
    <section className='hero'>
      <div className='hero-content'>
        <h1>Find the Right Lawyer</h1>
        <p>For Your Legal Needs</p>
        <div className='search-box'>
          {/* <input type='text' placeholder='Specialization' /> */}
          <select value={specialization} onChange={(e) => setSpecialization(e.target.value)} className='specialization-select'> 

               <option value="">Select Specialization</option>
                  <option value="Criminal">Criminal</option>
                  <option value="Civil">Civil</option>
                  <option value="Family">Family</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Property">Property</option>
                  <option value="Cyber">Cyber</option>
                  <option value="Other">Other</option>
          </select>
       
          <button onClick={handleSearch}>Find Lawyer</button>
        </div>
      </div>
    </section>
    {/* features */}
    <section className='features'>
      <div className='feature-card'>    
        <h3>Verified Lawyers</h3>
        <p>All lawyers are verified by admin</p>
      </div>
        <div className='feature-card'>
        <h3>Easy Appointments</h3>
        <p>Book appointments instantly</p>
      </div>
      <div className='feature-card'>
        <h3>Secure Chat</h3>
        <p>Chat privately with your lawyer</p>
      </div>
      <div className='feature-card'>
        <h3>Secure Payment</h3>
        <p>Secure and easy payment processing</p>
      </div>

   
    </section>

     {/* footer */}
   
  </div>
    )

}

export default Home ;