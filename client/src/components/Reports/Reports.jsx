import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './reports.scss';

const Reports = () => {
    const [reports, setReports] = useState();

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

    };

  return (
    <div className='container'>
        <div className='content'>
            <h1>Reports</h1>
            <div className='create-report'>
                <button className='btn' onClick={() => handleCreateReport()}>
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
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default Reports