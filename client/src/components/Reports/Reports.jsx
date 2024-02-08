import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './reports.scss';
import CreateReport from '../Modal/CreateReport';
import AddTask from '../Modal/AddTask';
import UpdateTask from '../Modal/UpdateTask';

const Reports = () => {
    const [reports, setReports] = useState();
    const [isCreateReportModalOpen, setIsCreateReportModalOpen] = useState(false);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [isUpdateTaskModalOpen, setIsUpdateTaskModalOpen] = useState(false);
    const [usernameInput, setUsernameInput] = useState('');
    const [taskTitleInput, setTaskTitleInput] = useState('');
    const [taskFinishedInput, setTaskFinishedInput] = useState(false);
    const [currentReportId, setCurrentReportId] = useState(null);
    const [currentTaskId, setCurrentTaskId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [reportsShowed, setReportsShowed] = useState(9);

    useEffect(() => {
      getAllReports();
    },[])

    const getAllReports = () => {
        axios.get("http://localhost:8080/reports")
        .then((res) => {
          setReports(res.data.reverse());
        })
        .catch((error) => {
          console.log("error", error);
        });
    }

    const handleCreateReport = () => {
        if( usernameInput.length !== 0) {
            axios.post("http://localhost:8080/reports", {
            username: usernameInput,
            tasks: [],
            })
            .then((res) => {
                getAllReports();
                setErrorMessage('');
                closeCreateReportModal();
            })
            .catch((error) => {
                console.error("Error creating report:", error);
            });
        }
        else {
            setErrorMessage("Please enter your name!");
        }
    };
    
    const handleAddTask = () => {
        const reportId = currentReportId;
        if (taskTitleInput.length !== 0) {
            axios.post("http://localhost:8080/reports/task", {
                reportId: reportId,
                title: taskTitleInput,
                finished: taskFinishedInput || false,
            })
            .then(() => {
                getAllReports();
                setErrorMessage('');
                closeAddTaskModal(); 
            })
            .catch((error) => {
                console.error("Error creating task:", error);
            });
        } else {
            setErrorMessage("Please enter the task title!");
        }
    };    
        
    const handleUpdateTask = () => {
        const reportId = currentReportId;
        const taskId = currentTaskId;
        if (taskTitleInput.length !== 0) {
            axios.put(`http://localhost:8080/reports/${reportId}/task/${taskId}`, {
                title: taskTitleInput,
                finished: taskFinishedInput || false,
            })
            .then(() => {
                getAllReports();
                setErrorMessage('');
                closeUpdateTaskModal(); 
            })
            .catch((error) => {
                console.error("Error creating task:", error);
            });
        } else {
            setErrorMessage("Please enter the task title!");
        }
    };

    const handleDeleteReport = (id) => {
        axios.delete(`http://localhost:8080/reports/${id}`)
        .then(()=>{
           getAllReports();
        })
        .catch((error) => {
            console.log("error", error)
        })
    };

    const handleDeleteTask = (reportId, taskId) => {
        axios.delete(`http://localhost:8080/reports/${reportId}/task/${taskId}`)
        .then(()=>{
           getAllReports();
        })
        .catch((error) => {
            console.log("error", error)
        })
    };

    const handleOpenAddTaskModal = (reportId) => {
        setIsAddTaskModalOpen(true);
        setCurrentReportId(reportId);
    };

    const handleOpenUpdateTaskModal = (reportId, task) => {
        setCurrentReportId(reportId);
        setCurrentTaskId(task._id);
        setTaskTitleInput(task.title);
        setTaskFinishedInput(task.finished);
        setIsUpdateTaskModalOpen(true);
    };

    const closeCreateReportModal = () => {
        setIsCreateReportModalOpen(false);
        setUsernameInput('');
        setErrorMessage('');      
    };

    const closeAddTaskModal = () => {
        setIsAddTaskModalOpen(false);
        setCurrentReportId(null);
        setTaskTitleInput('');
        setTaskFinishedInput(false);
        setErrorMessage('');      
    };

    const closeUpdateTaskModal = () => {
        setCurrentReportId(null);
        setCurrentTaskId(null);
        setTaskTitleInput('');
        setTaskFinishedInput(false);
        setIsUpdateTaskModalOpen(false);
        setErrorMessage('');     
    };
    
    const handleUsernameChange = (event) => {
        setUsernameInput(event.target.value);
    };

    const handleTaskTileChange = (event) => {
        setTaskTitleInput(event.target.value);
    };

    const handleTaskFinishedChange = (event) => {
        setTaskFinishedInput(event.target.checked);
    };

    const formatDate = (givenDate) => {
        const date = new Date(givenDate);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const fullDate = day + "/" + month + "/" + year;

        return fullDate;
    }

    const handleLoadMore = () => {
        if(reportsShowed < reports.length) {
            setReportsShowed(reportsShowed + 3);
        }
    }
    
    
  return (
    <div className='container'>
        <div className='content'>
            <h1>Reports</h1>
            <div className='create-report'>
                <button className='btn' onClick={() => setIsCreateReportModalOpen(true)}>
                    Create a new Report
                </button>
            </div>
            <div className='all-reports'>
                {reports?.slice(0, reportsShowed).map((report) => (
                    <div className='single-report' key={report._id}>
                        <div className='report-row'>
                            <span>Name:</span>
                            <span className='username'>{report.username}</span>
                            <button type='button' className='btn-small' onClick={() => handleDeleteReport(report._id)}>
                                X
                            </button>
                        </div>
                        <div className='report-row'>
                            <span>Date:</span>
                            <span>{formatDate(report.date)}</span>
                        </div>
                        <div className='tasks'>
                            <div className='top-content'>
                                <h5>Tasks:</h5>
                                <button className='btn-small' onClick={() => handleOpenAddTaskModal(report._id)}>
                                    +
                                </button>
                            </div>
                            <div className='all-tasks'>
                                {report.tasks?.map((task) => (
                                    <div key={task._id} className='single-task'>
                                        <span className={`${task.finished ? "finished" : ""}`}>{task.title}</span>
                                        <div className='buttons'>
                                            <button className='btn-small update' onClick={() => handleOpenUpdateTaskModal(report._id, task)}>
                                                &#9998;
                                            </button>
                                            <button className='btn-small' onClick={() => handleDeleteTask(report._id, task._id)}>
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
            { reportsShowed < reports?.length && 
                <button className='btn load-more' onClick={() => handleLoadMore()}>
                    Load More
                </button>
            }
            <CreateReport
                isOpen={isCreateReportModalOpen}
                closeModal={closeCreateReportModal}
                handleCreateReport={handleCreateReport}
                handleUsernameChange={handleUsernameChange}
                usernameInput={usernameInput}
                errorMessage={errorMessage}
                label="Username"
            />
            <AddTask
                isOpen={isAddTaskModalOpen}
                closeModal={closeAddTaskModal}
                handleAddTask={handleAddTask}
                handleTaskTitleChange={handleTaskTileChange}
                handleTaskFinishedChange={handleTaskFinishedChange}
                taskTitleInput={taskTitleInput}
                taskFinishedInput={taskFinishedInput}
                errorMessage={errorMessage}
                label="Task Title"
            />
            <UpdateTask
                isOpen={isUpdateTaskModalOpen}
                closeModal={closeUpdateTaskModal}
                handleUpdateTask={handleUpdateTask}
                handleTaskTitleChange={handleTaskTileChange}
                handleTaskFinishedChange={handleTaskFinishedChange}
                taskTitleInput={taskTitleInput}
                taskFinishedInput={taskFinishedInput}
                errorMessage={errorMessage}
                label="Task Title"
            />
        </div>
    </div>
  )
}

export default Reports;