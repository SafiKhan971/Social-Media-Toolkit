import { GoogleLogin } from '@react-oauth/google'
import api from '../services/api'

const apiUrl = import.meta.env.VITE_API_BASE_URL

export default function GoogleLoginButton() {
  const handleSuccess = async (credentialResponse) => {
    try {
      const { data } = await api.post(
        `${apiUrl}/auth/google-login`,
        {
          credential: credentialResponse.credential,
        }
      )

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      window.location.href = '/'
    } catch (err) {
      console.log(err)
    }
  }

  return <GoogleLogin onSuccess={handleSuccess} />
}