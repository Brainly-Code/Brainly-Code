import React from 'react'
import Header from './ui/Header'
import user from '../assets/user.png'
import messenger from '../assets/messenger.png'
import Footer from './ui/Footer'

export const Community = () => {
    return (
        <div>
            <Header />
            <h1 className='text-center'>Community</h1>
            <h5>Need help?</h5>


            <div>
                <div><img src={user} /></div>
                <span>Nshuti Christian</span>
                <span>Teacher</span>
                <img src={messenger} />
            </div>


            <div>
                <div>1</div>
                <div>2</div>
                <div>3</div>
            </div>


            <div>
                <h5>Leave a comment</h5>
                <textarea />
                <button>Send</button>
            </div>


            <Footer />
        </div>
    )
}

export default Community
