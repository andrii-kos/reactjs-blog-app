import React, { Component } from 'react';

import Image from '../../../components/Image/Image';
import './SinglePost.css';

class SinglePost extends Component {
  state = {
    title: '',
    author: '',
    date: '',
    image: '',
    content: ''
  };

  componentDidMount() {
    const postId = this.props.match.params.postId;
    const graphqlQuery = {
      query: `
        query FetchPost($postId: ID!) {
          post(id: $postId) {
            _id
            title
            content
            createdAt
            imageUrl
            creator {
              name
            }
        }
      }
      `,
      variables: {
        postId
      }
    }

    fetch(`https://us-central1-nodejs-blog-server.cloudfunctions.net/api/graphql`, {
      method: 'POST',
      body: JSON.stringify(graphqlQuery),
      headers: {
        Authorization: 'Bearer ' + this.props.token,
        "Content-Type": "Application/json"
      }
    })
      .then(res => res.json())
      .then(response => {
        console.log(response)
        this.setState({
          title: response.data.post.title,
          image: `https://us-central1-nodejs-blog-server.cloudfunctions.net/api/${response.data.post.imageUrl}`,
          author: response.data.post.creator.name,
          date: new Date(response.data.post.createdAt).toLocaleDateString('en-US'),
          content: response.data.post.content
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <section className="single-post">
        <h1>{this.state.title}</h1>
        <h2>
          Created by {this.state.author} on {this.state.date}
        </h2>
        <div className="single-post__image">
          <Image contain imageUrl={this.state.image} />
        </div>
        <p>{this.state.content}</p>
      </section>
    );
  }
}

export default SinglePost;
