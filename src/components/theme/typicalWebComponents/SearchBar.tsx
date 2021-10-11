import React, { FormEvent } from 'react';

class SearchBar extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      "value": "",
      "error": ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event: any) {

    this.setState({ "value": event.target.value });
    if ((event.target.value as String).length > 2) {
      this.props.queryFuntion(event.target.value);
      var tempState = { ...this.state };
      tempState.error = '';
      tempState.value = event.target.value;
      this.setState(tempState);
    } else if ((event.target.value as String).length <= 2 && (event.target.value as String).length > 0) {
      var tempState = { ...this.state };
      tempState.error = 'Podaj co najmniej 3 znaki';
      tempState.value = event.target.value;
      this.setState(tempState);
    } else if ((event.target.value as String).length == 0) {
      this.props.queryFuntion(event.target.value);
      var tempState = { ...this.state };
      tempState.error = '';
      tempState.value = event.target.value;
      this.setState(tempState);
    }

    ;
  }

  handleSubmit(event: any) {
    event.preventDefault();
    // console.log(`event in handleSubmit is ${event.target.value}`);
  }

  render() {
    return (
      <div className="ui row" style={{ padding: '8px', backgroundColor: '#f9fafb' }}>
        <div className="ui fluid search" style={{ marginTop: "10px", marginBottom: "10px" }}>
          <div className="ui fluid icon input">
            <input className="ui icon input  search fiveteen wide column" style={{ fontSize: "2em" }} type="text" placeholder="Szukaj" onChange={this.handleChange} value={this.state.value} />
            <i className="search icon"></i>

          </div>
        </div>
        {
          this.state.error ? <div className="ui pointing label">
            {this.state.error}
          </div> :
            null
        }
      </div>
    );
  }
}

export default SearchBar;