import React from 'react'
import structLogo from './images/struct-logo.png'
import {Image} from 'semantic-ui-react'

class Loading extends React.Component {
    render() {
        return(
        <div id='loading'>
            <Image src={structLogo} alt='loading icon'/>
        </div>
    ) }
}

export default Loading