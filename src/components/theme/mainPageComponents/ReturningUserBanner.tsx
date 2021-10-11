import React from "react";
import MainMenu from "../typicalWebComponents/MainMenu";

class ReturningUserBanner extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      lastQuery: props.lastQuery,
    };
  }

  render() {
    return (
      <div className="ui  column ">
        <div className="ui segment">
          <h3 style={{ textAlign: "center" }}>Miło nam że wróciłeś na naszą stronę.</h3>
          <p style={{ textAlign: "center" }}>Wyświetlamy ostatnio wyszukane dane.<br />Wyszukana fraza to: <span style={{ color: 'red', fontWeight: 'bold', fontSize: '1.5em' }}>{this.state.lastQuery}</span>.<br /> Jeżeli chcesz zbaczyć wszystkie wykresy kliknij <a href="/" onClick={() => MainMenu.clearUserCookie()}>HOME</a></p>
        </div>

      </div>
    );
  }
}

export default ReturningUserBanner;
