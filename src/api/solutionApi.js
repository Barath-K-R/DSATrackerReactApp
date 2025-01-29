import axios from 'axios';
import { refreshAccessToken } from './authApi.js';


const solutionApi = axios.create({
  baseURL: 'http://localhost:5000/api/solutions',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const setupSolutionApiInterceptor = (accessToken,dispatch) => {


  solutionApi.interceptors.request.use(
    (config) => {
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );


  solutionApi.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const { data } = await refreshAccessToken();

          dispatch({ type: 'SET_TOKEN', payload: data.accessToken });

          originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;

          return solutionApi(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export const createSolution = (solutionData) => solutionApi.post('/', solutionData);
export const getAllSolutionByProblemName = (problemName) =>
  solutionApi.get(`/?problemName=${problemName}`);
export const deleteSolution = (solutionId) => solutionApi.delete(`/${solutionId}`);

export default solutionApi;
