import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './reports.scss';
import CreateReport from '../Modal/CreateReport';

const Reports = () => {
    const [reports, setReports] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [usernameInput, setUsernameInput] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        axios.get("http://localhost:8080/reports")
        .then((res)=>{
            setReports(res.data)
            console.log(res.data);
        })
        .catch((error) => {
            console.log("error", error)
        })
    },[])

    const handleCreateReport = () => {
        if( usernameInput.length !== 0) {
            axios.post("http://localhost:8080/reports", {
            username: usernameInput,
            tasks: [],
            })
            .then((res) => {
            console.log(res.data);
            setReports((prevReports) => [...prevReports, res.data]);
            setErrorMessage('');
            closeModal();
            })
            .catch((error) => {
            console.error("Error creating report:", error);
            });
        }
        else {
            setErrorMessage("Please enter your name!");
        }
    };

    const handeDeleteReport = (id) => {
        axios.delete(`http://localhost:8080/reports/${id}`)
        .then((res)=>{
            axios.get("http://localhost:8080/reports")
            .then((res) => {
              setReports(res.data);
              console.log(res.data);
            })
            .catch((error) => {
              console.log("error", error);
            });
        })
        .catch((error) => {
            console.log("error", error)
        })
    }

      

    const closeModal = () => {
        setIsModalOpen(false);
        setUsernameInput('');
        setErrorMessage('');
      };
    
    const handleUsernameChange = (event) => {
        setUsernameInput(event.target.value);
        console.log(event.target.value);
    };

  return (
    <div className='container'>
        <div className='content'>
            <h1>Reports</h1>
            <div className='create-report'>
                <button className='btn' onClick={() => setIsModalOpen(true)}>
                    Create a new Report
                </button>
            </div>
            <div className='all-reports'>
                {reports?.map((report) => (
                    <div className='single-report' key={report._id}>
                        <div className='report-row'>
                            <span>Name:</span>
                            <span className='username'>{report.username}</span>
                        </div>
                        <div className='report-row'>
                            <span>Date:</span>
                            <span>{report.date}</span>
                        </div>
                        <div className='tasks'>
                            <div className='top-content'>
                                <h5>Tasks:</h5>
                                <button className='btn-small'>
                                    +
                                </button>
                            </div>
                            <div className='all-tasks'>
                                {report.tasks?.map((task) => (
                                    <div key={task._id} className='single-task'>
                                        <span className={`${task.finished ? "finished" : ""}`}>{task.title}</span>
                                        <div className='buttons'>
                                            <button className='btn-small'>
                                                &#9998;
                                            </button>
                                            <button className='btn-small'>
                                                X
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='delete-report'>
                            <button type='button' className='btn' onClick={() => handeDeleteReport(report._id)}>
                                Delete report
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <CreateReport
                isOpen={isModalOpen}
                closeModal={closeModal}
                handleCreateReport={handleCreateReport}
                handleUsernameChange={handleUsernameChange}
                usernameInput={usernameInput}
                errorMessage={errorMessage}
                label="Username"
            />
        </div>
    </div>
  )
}

export default Reports