import React, { useState, useEffect, useCallback } from 'react';
import { 
  Briefcase, 
  Upload, 
  CheckCircle, 
  XCircle, 
  User, 
  FileText, 
  LogOut, 
  Users,
  AlertCircle,
  Plus,
  Loader
} from 'lucide-react';


const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
console.log(import.meta.env.VITE_API_BASE_URL);



/* ###########################################################################
   ###########################################################################
   ##                                                                       ##
   ##                       API HELPER (REAL BACKEND)                       ##
   ##                                                                       ##
   ###########################################################################
   ###########################################################################
*/

const apiCall = async (endpoint, method = 'GET', body = null, token = null, isFormData = false) => {
  const headers = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Only set Content-Type if it's NOT FormData (browser sets boundary for FormData automatically)
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.msg || `Error ${response.status}: ${response.statusText}`);
    }
    
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};


/* ###########################################################################
   ###########################################################################
   ##                                                                       ##
   ##                          NAVBAR COMPONENT                             ##
   ##                                                                       ##
   ###########################################################################
   ###########################################################################
*/
const Navbar = ({ user, onLogout }) => (
  <nav className="bg-slate-900 text-white p-4 shadow-lg sticky top-0 z-50">
    <div className="max-w-6xl mx-auto flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Briefcase className="w-6 h-6 text-blue-400" />
        <span className="text-xl font-bold tracking-tight">JobMatch</span>
      </div>
      
      {user && (
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-slate-300 hidden sm:flex">
            <User className="w-4 h-4" />
            <span className="capitalize">{user.name} ({user.role})</span>
          </div>
          <button 
            onClick={onLogout}
            className="text-sm hover:text-white transition-colors flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-md"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      )}
    </div>
  </nav>
);


/* ###########################################################################
   ###########################################################################
   ##                                                                       ##
   ##                       AUTH SCREEN COMPONENT                           ##
   ##                                                                       ##
   ###########################################################################
   ###########################################################################
*/
const AuthScreen = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'seeker'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login Logic
        const data = await apiCall('/auth/login', 'POST', {
          email: formData.email,
          password: formData.password
        });
        
        localStorage.setItem('token', data.token);
        
        // Fetch User Details after login
        const user = await apiCall('/users/me', 'GET', null, data.token);
        onLogin(user, data.token);
      } else {
        // Register Logic
        await apiCall('/auth/register', 'POST', formData);
        setIsLogin(true); 
        setError('Registration successful! Please login.');
        setLoading(false);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-6">
          <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="text-slate-500">Job matching made intelligent</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">I am a...</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, role: 'seeker'})}
                    className={`p-2 rounded-lg border text-sm font-medium transition-colors ${formData.role === 'seeker' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-slate-200 text-slate-600'}`}
                  >
                    Job Seeker
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, role: 'recruiter'})}
                    className={`p-2 rounded-lg border text-sm font-medium transition-colors ${formData.role === 'recruiter' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-slate-200 text-slate-600'}`}
                  >
                    Recruiter
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-lg transition-all flex justify-center items-center gap-2"
          >
            {loading && <Loader className="w-4 h-4 animate-spin" />}
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-sm text-blue-600 hover:underline"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};


/* ###########################################################################
   ###########################################################################
   ##                                                                       ##
   ##                     SEEKER DASHBOARD COMPONENT                        ##
   ##                                                                       ##
   ###########################################################################
   ###########################################################################
*/
const SeekerDashboard = ({ user, token, refreshUser }) => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('jobs');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [jobsData, appsData] = await Promise.all([
        apiCall('/jobs', 'GET', null, token),
        apiCall('/applications/me', 'GET', null, token)
      ]);
      setJobs(jobsData);
      setApplications(appsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await apiCall('/resume/upload', 'POST', formData, token, true);
      alert(`Resume uploaded! Skills detected: ${response.skills.join(', ')}`);
      await refreshUser(); 
      fetchData(); 
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleApply = async (jobId) => {
    try {
      await apiCall(`/applications/${jobId}`, 'POST', {}, token);
      alert('Application submitted successfully!');
      fetchData(); 
    } catch (err) {
      alert(err.message);
    }
  };

  const hasSkills = user.skills && user.skills.length > 0;

  if (loading) return <div className="flex justify-center p-10"><Loader className="animate-spin text-blue-600" /></div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {!hasSkills ? (
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200 text-center mb-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Upload your Resume to Begin</h2>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">Our AI extracts your skills and matches you with the best opportunities.</p>
          
          <label className={`inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-all ${uploading ? 'opacity-75' : ''}`}>
            {uploading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" /> <span>Parsing...</span>
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" /> <span>Select PDF Resume</span>
              </>
            )}
            <input type="file" className="hidden" accept=".pdf" onChange={handleResumeUpload} disabled={uploading} />
          </label>
        </div>
      ) : (
        <div className="mb-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Your Skills</h3>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium capitalize">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <button 
             onClick={() => document.getElementById('resume-reupload').click()}
             className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
             <Upload className="w-4 h-4" /> Update Resume
             <input id="resume-reupload" type="file" className="hidden" accept=".pdf" onChange={handleResumeUpload} />
          </button>
        </div>
      )}

      <div className="flex gap-8 border-b border-slate-200 mb-6">
        <button 
          onClick={() => setActiveTab('jobs')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'jobs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Matched Jobs
        </button>
        <button 
          onClick={() => setActiveTab('applications')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'applications' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          My Applications
        </button>
      </div>

      {activeTab === 'jobs' ? (
        <div className="grid gap-4">
          {jobs.map(job => {
            const isApplied = applications.some(app => app.job?._id === job._id);
            const score = job.score ? Math.round(job.score * 100) : 0;
            
            return (
              <div key={job._id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{job.title}</h3>
                    <p className="text-slate-500 text-sm mb-3">{job.company}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills && job.skills.map((skill, i) => (
                        <span key={i} className={`px-2 py-0.5 rounded text-xs capitalize ${user.skills?.includes(skill.toLowerCase()) ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-slate-100 text-slate-500'}`}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  {user.skills.length > 0 && (
                     <div className="text-right">
                       <div className={`text-2xl font-bold ${score > 70 ? 'text-green-600' : score > 40 ? 'text-yellow-600' : 'text-slate-400'}`}>
                         {score}%
                       </div>
                       <div className="text-xs text-slate-400">Match</div>
                     </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center mt-4 border-t border-slate-100 pt-4">
                  <p className="text-sm text-slate-600 line-clamp-2">{job.description}</p>
                  {isApplied ? (
                    <span className="px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Applied
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApply(job._id)}
                      disabled={!hasSkills}
                      className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${hasSkills ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {jobs.length === 0 && <p className="text-center text-slate-500 py-10">No jobs found.</p>}
        </div>
      ) : (
        <div className="space-y-4">
          {applications.length === 0 && <div className="text-center py-10 text-slate-500">No applications yet.</div>}
          {applications.map(app => (
            <div key={app._id} className="bg-white p-5 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-slate-800">{app.job?.title || 'Unknown Job'}</h4>
                <p className="text-sm text-slate-500">{app.job?.company}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 capitalize
                ${app.status === 'shortlisted' ? 'bg-green-100 text-green-700' : 
                  app.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {app.status === 'shortlisted' && <CheckCircle className="w-4 h-4" />}
                {app.status === 'rejected' && <XCircle className="w-4 h-4" />}
                {app.status !== 'shortlisted' && app.status !== 'rejected' && <AlertCircle className="w-4 h-4" />}
                {app.status || 'Pending'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


/* ###########################################################################
   ###########################################################################
   ##                                                                       ##
   ##                  RECRUITER DASHBOARD COMPONENT                        ##
   ##                                                                       ##
   ###########################################################################
   ###########################################################################
*/
const RecruiterDashboard = ({ user, token }) => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', company: '', skills: '', description: '' });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const allJobs = await apiCall('/jobs', 'GET', null, token);
      // Assuming backend returns all jobs, filter for current recruiter or backend handles filtering
      const myJobs = allJobs.filter(j => j.recruiter === user._id);
      setJobs(myJobs);
      
      if (myJobs.length > 0 && !selectedJobId) setSelectedJobId(myJobs[0]._id);

      const apps = await apiCall('/applications/recruiter', 'GET', null, token);
      setApplications(apps);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token, user._id, selectedJobId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = newJob.skills.split(',').map(s => s.trim()).filter(s => s);
      await apiCall('/jobs', 'POST', { ...newJob, skills: skillsArray }, token);
      setShowCreateModal(false);
      setNewJob({ title: '', company: '', skills: '', description: '' });
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStatusUpdate = async (appId, status) => {
    try {
      await apiCall(`/applications/${appId}/status`, 'PATCH', { status }, token);
      // Optimistic UI update
      setApplications(prev => prev.map(a => a._id === appId ? { ...a, status } : a));
    } catch (err) {
      alert(err.message);
    }
  };

  const selectedJob = jobs.find(j => j._id === selectedJobId);
  const jobApplications = applications.filter(app => app.job && app.job._id === selectedJobId);

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Sidebar - Jobs List */}
      <div className="md:col-span-1 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-slate-600" />
            Your Jobs
          </h2>
        </div>
        
        <div className="space-y-2">
          {jobs.map(job => (
            <button
              key={job._id}
              onClick={() => setSelectedJobId(job._id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${selectedJobId === job._id ? 'bg-white border-blue-500 ring-1 ring-blue-500 shadow-sm' : 'bg-white border-slate-200 hover:border-blue-300'}`}
            >
              <h3 className={`font-semibold ${selectedJobId === job._id ? 'text-blue-700' : 'text-slate-700'}`}>{job.title}</h3>
              <div className="flex justify-between items-center mt-2">
                 <span className="text-xs text-slate-500 truncate max-w-[120px]">
                   {job.skills.slice(0, 2).join(', ')}...
                 </span>
                 <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 font-medium">
                   {applications.filter(a => a.job && a.job._id === job._id).length} applicants
                 </span>
              </div>
            </button>
          ))}
          {jobs.length === 0 && !loading && <p className="text-slate-400 text-sm italic p-2">You haven't posted any jobs yet.</p>}
        </div>

        <button 
          onClick={() => setShowCreateModal(true)}
          className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-medium hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> Post New Job
        </button>
      </div>

      {/* Main Content - Applications */}
      <div className="md:col-span-2">
        {selectedJob ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[500px] overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">
                 Applicants for <span className="text-blue-600">{selectedJob.title}</span>
              </h2>
            </div>

            <div className="divide-y divide-slate-100">
              {jobApplications.length === 0 ? (
                <div className="p-10 text-center text-slate-400 flex flex-col items-center">
                  <Users className="w-12 h-12 mb-2 opacity-50" />
                  <p>No applications received yet.</p>
                </div>
              ) : (
                jobApplications.map(app => (
                  <div key={app._id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">{app.seeker?.name}</h3>
                      <div className="text-sm text-slate-500 mb-2">{app.seeker?.email}</div>
                      <div className="flex flex-wrap gap-2">
                        {app.seeker?.skills.map((skill, i) => (
                          <span key={i} className={`text-xs px-2 py-1 rounded capitalize ${selectedJob.skills.includes(skill) ? 'bg-green-100 text-green-700 font-bold' : 'bg-slate-100 text-slate-500'}`}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {!app.status || (app.status !== 'shortlisted' && app.status !== 'rejected') ? (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate(app._id, 'rejected')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200 transition-all flex items-center gap-1 text-sm font-medium"
                          >
                            <XCircle className="w-4 h-4" /> Reject
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(app._id, 'shortlisted')}
                            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-1 text-sm font-medium shadow-sm"
                          >
                            <CheckCircle className="w-4 h-4" /> Shortlist
                          </button>
                        </>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 ${app.status === 'shortlisted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {app.status === 'shortlisted' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                          {app.status.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 p-10 border-2 border-dashed border-slate-200 rounded-2xl">
            <Briefcase className="w-16 h-16 mb-4 opacity-20" />
            <p>Select a job to view applications</p>
          </div>
        )}
      </div>

      {/* Modal for Creating Job */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Post New Job</h2>
            <form onSubmit={handleCreateJob} className="space-y-4">
              <input 
                placeholder="Job Title" 
                className="w-full p-2 border rounded"
                value={newJob.title}
                onChange={e => setNewJob({...newJob, title: e.target.value})}
                required
              />
              <input 
                placeholder="Company Name" 
                className="w-full p-2 border rounded"
                value={newJob.company}
                onChange={e => setNewJob({...newJob, company: e.target.value})}
                required
              />
              <input 
                placeholder="Required Skills (comma separated)" 
                className="w-full p-2 border rounded"
                value={newJob.skills}
                onChange={e => setNewJob({...newJob, skills: e.target.value})}
                required
              />
              <textarea 
                placeholder="Job Description" 
                className="w-full p-2 border rounded h-32"
                value={newJob.description}
                onChange={e => setNewJob({...newJob, description: e.target.value})}
                required
              />
              <div className="flex gap-2 justify-end mt-4">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Post Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* ###########################################################################
   ###########################################################################
   ##                                                                       ##
   ##                           MAIN APP COMPONENT                          ##
   ##                                                                       ##
   ###########################################################################
   ###########################################################################
*/

const App = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async (authToken) => {
    if (!authToken) {
      setIsLoading(false);
      return;
    }
    try {
      const userData = await apiCall('/users/me', 'GET', null, authToken);
      setUser(userData);
    } catch (err) {
      console.error("Session expired or invalid:", err);
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchUser(token);
    } else {
      setIsLoading(false);
    }
  }, [token, fetchUser]);

  const handleLogin = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center"><Loader className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar user={user} onLogout={handleLogout} />
      
      {!user ? (
        <AuthScreen onLogin={handleLogin} />
      ) : (
        <main>
          {user.role === 'recruiter' ? (
            <RecruiterDashboard user={user} token={token} />
          ) : (
            <SeekerDashboard user={user} token={token} refreshUser={() => fetchUser(token)} />
          )}
        </main>
      )}
    </div>
  );
};

export default App;