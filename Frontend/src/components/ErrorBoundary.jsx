import {Component} from 'react';
export default class ErrorBoundary extends Component{
  constructor(p){super(p);this.state={error:null}}
  static getDerivedStateFromError(error){return {error}}
  componentDidCatch(error,info){console.error('UI crash:',error,info)}
  render(){
    if(this.state.error) return <div className="center"><div><h1>Something went wrong</h1><p className="muted">{this.state.error?.message||'Unexpected error'}</p><button onClick={()=>{this.setState({error:null});window.location.href='/'}}>Back to Missions</button></div></div>;
    return this.props.children;
  }
}
