import React, { Component } from 'react'
import { Form, Input } from 'semantic-ui-react'
import { connect } from 'react-redux'


class EditUser extends Component {
    state={
        f_name: '',
        l_name: '',
        email: '',
        phone: '',
        company: '',
        company_phone: '',
        company_email: '',
        }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    componentDidMount = () => {
        fetch(`http://localhost:3000/users/${this.props.currentUser}`, {
            credentials: 'include'
        })
        .then(r => {
            if(r.ok) {
                return r.json()
            } else {
                throw r
            }
        })
        .then(user => {
            //TODO: refactor with destructuring
            this.setState({
                f_name: user.f_name,
                l_name: user.l_name,
                email: user.email,
                phone: user.phone,
                company: user.company,
                company_phone: user.company_phone,
                company_email: user.company_email
            })
        })
        .catch(error => console.error(error))
    }

    handleSubmit = e => {
        e.preventDefault()
        fetch(`http://localhost:3000/users/${this.props.currentUser}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then(r => {
            if(r.ok) {
                return r.json()
            } else {
                throw r
            }
        })
        .then(user => {
            this.props.setUser(user.id)
            this.props.history.push('/jobs')
        })
        .catch(error => console.log(error))
    }


    render() {
        return(
            <Form onSubmit={this.handleSubmit}>
                <Form.Group>
                    <Form.Field
                    control={Input}
                    label={'First Name'}
                    value={this.state.f_name}
                    onChange={this.handleChange}
                    name='f_name'
                    />
                    <Form.Field
                    control={Input}
                    label={'Last Name'}
                    value={this.state.l_name}
                    onChange={this.handleChange}
                    name='l_name'
                    />
                    {/* TODO: create special authorization window to edit passwork */}
                </Form.Group>
                <Form.Group>
                    <Form.Field
                    control={Input}
                    label={'Email'}
                    value={this.state.email}
                    onChange={this.handleChange}
                    name='email'
                    />
                    <Form.Field
                    control={Input}
                    label={'Phone'}
                    value={this.state.phone}
                    onChange={this.handleChange}
                    name='phone'
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Field
                    control={Input}
                    label={'Company'}
                    value={this.state.company}
                    onChange={this.handleChange}
                    name='company'
                    />
                    <Form.Field
                    control={Input}
                    label={'Company Phone'}
                    value={this.state.company_phone}
                    onChange={this.handleChange}
                    name='company_phone'
                    />
                    <Form.Field
                    control={Input}
                    label={'Company Email'}
                    value={this.state.company_email}
                    onChange={this.handleChange}
                    name='company_email'
                    />
                </Form.Group>
                <Input type='submit' value='Save Changes' />
            </Form>
            
        )
    
    }
}

const mapStateToProps = state => {
    return {
        currentUser: state.currentUser
    }
}

const matchDispatchToProps = dispatch => {
    return {
        setUser: id => dispatch({type: 'SET_USER', id})
    }
}

export default connect(mapStateToProps, matchDispatchToProps)(EditUser)