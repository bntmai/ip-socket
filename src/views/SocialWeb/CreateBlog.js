import React, { Component } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  Row,
} from 'reactstrap';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../../index.css';
import { blogs, auth } from "../../actions";
import { connect } from "react-redux";
import {stateToHTML} from 'draft-js-export-html';


class Forms extends Component {
  state = {
    title: "",
    content: "",
    userId: "",
  }

  onSubmit = e => {
    e.preventDefault();
    this.props.addBlog(this.state.title, this.state.content, this.state.userId);
  }

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      editorState: EditorState.createEmpty(),
    };
  }

  onEditorStateChange: Function = (editorState) => {
    const contentState = editorState.getCurrentContent();
    const id = sessionStorage.getItem("id");
    this.setState({
      editorState,
      content: stateToHTML(contentState),
      userId: id,
    });
  };

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState } });
  }

  render() {
    const { editorState } = this.state;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" md="12">
            <Card>
              <CardHeader>
                <strong>Create a new blog post</strong>
              </CardHeader>
              <CardBody>
                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal" onSubmit={this.onSubmit}>
                  <FormGroup row>
                    <Col md="3">
                      <Label>Static</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <p className="form-control-static">Username</p>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Title</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="text-input" placeholder="Input title of this blog" onChange={e => this.setState({ title: e.target.value })} />
                      <FormText color="muted">Make it special</FormText>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Editor
                      editorState={editorState}
                      wrapperClassName="wrapperClassName"
                      editorClassName="editorClassName"
                      onEditorStateChange={this.onEditorStateChange}
                      hashtag={{
                        separator: ' ',
                        trigger: '#',
                      }}
                      toolbar={{
                        image: {
                          uploadEnabled: true,
                          previewImage: true,
                        }
                      }}
                    />
                    <Input hidden />
                  </FormGroup>
                  <CardFooter>
                    <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>
                    <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
                  </CardFooter>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addBlog: (title, content, userId) => dispatch(blogs.addBlog(title, content, userId)),
  };
}

export default connect(null,mapDispatchToProps)(Forms);