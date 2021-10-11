import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';


export default class MainMenu extends Component {
  state = { activeItem: '' };



  handleItemClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    { name }: { [key: string]: string | undefined }
  ) => {
    this.setState({ activeItem: name });
  }

  public static async clearUserCookie() {
    // var domain = document.domain;
    // var path = "/";
    document.cookie = "userUUID= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
  };



  render() {
    const { activeItem } = this.state;

    return (
      <Menu compact={false} stackable={true} widths={4} size="massive">
        <Menu.Item as={Link} to={"/"}

          name="root"
          active={activeItem === 'root'}
          header={false}
          onClick={async (event) => {
            await MainMenu.clearUserCookie();
            // console.log(`document.cookie  in Home click is ${document.cookie}`)
            //   ;

            this.handleItemClick(event, { activeItem: "root" });
            window.location.reload();
          }}
        >
          <p style={{ color: '#4183c4', fontSize: '1.8em' }}>Home</p>
        </Menu.Item>

        <Menu.Item as={Link} to={"/tabele"}
          name="tabele"
          active={activeItem === 'tabele'}
          header={false}
          onClick={async (event) => {
            this.handleItemClick(event, { activeItem: "tabele" });
          }}
        >
          <p style={{ color: '#4183c4', fontSize: '1.8em' }}>Tabele</p>
        </Menu.Item>

        <Menu.Item as={Link} to={"/wykresy"}
          name="wykresy"
          active={activeItem === 'wykresy'}
          header={false}
          onClick={async (event) => {
            this.handleItemClick(event, { activeItem: "wykresy" });
          }}
        >
          <p style={{ color: '#4183c4', fontSize: '1.8em' }}>Wykresy</p>
        </Menu.Item>

        <Menu.Item as={Link} to={"/mapy"}
          name="mapy"
          active={activeItem === 'mapy'}
          header={false}
          onClick={async (event) => {
            this.handleItemClick(event, { activeItem: "mapy" });
          }}
        >
          <p style={{ color: '#4183c4', fontSize: '1.8em' }}>Mapy</p>
        </Menu.Item>
      </Menu>
    );
  }
}

