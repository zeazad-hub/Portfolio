import React from 'react'
import Container from './Container';

class ItemBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Items: this.props.items,
            shouldRem: true
            /* dataRead: false */
        }
        /* this.setItems = this.setItems.bind(this);
        this.readItems(); */
        this.addItem = this.addItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
    }

    /* checkHeader(elem) {
        for(let i = 0; i < elem.length; i++) {
            if((!(isNaN(parseInt(elem[i])))) || (elem[i] === '')) {
                return false;
            }
        }
        return true;
    }

    setItems(result) {
        if(this.props.type === Type.Country) {
            var ind = 0;
            for(let i = 0; i < result.data.length; i++) {
                if(this.checkHeader(result.data[i])) {
                    ind = i;
                    break;
                }
            }
            const countryNames = result.data[ind].slice(1);

            this.setState({Items:  countryNames});
        }
        else {
            var readStart = result.data.length;
            var readEnd = result.data.length;
            for(let i = 0; i < result.data.length; i++) {
                if(this.checkHeader(result.data[i])) {
                    readStart = i+1;
                }

                //Break if the end of the rows for one of the tables are found
                if(result.data[i][0] === '') {
                    readEnd = i;
                    break;
                }
            }

            const prodNames = result.data.slice(readStart, readEnd).map ((elem) => {
                return elem[0];
            });

            this.setState({Items: prodNames});
            
        }
    }

    readItems() {
        const Parser = require('papaparse');
        if(this.props.dataAvail) {
            Parser.parse(this.props.file.files[0], {
                skipEmptyLines: true,
                complete: this.setItems
            })
        }
    } */

    addItem(item, ignore) {
        console.log(item.type);
        var list = this.state.Items.slice();

        // Check if item is already in the itemBox, if not then add the item
        // if the item is included then set dontRem to true so we do not do anything
        // in removeItem this time
        if(list.includes(item.id)) {
            this.setState({shouldRem: false});
        }
        else {
            list.push(item.id);
        }

        this.setState({Items: list});
    }

    removeItem(item, ignore) {
        console.log(item.type);
        if(this.state.shouldRem) {
            var list = this.state.Items.slice();
            var ind = list.indexOf(item.id);
            list.splice(ind, 1);
            this.setState({ Items: list });
        }
        else {
            this.setState({ shouldRem: true });
        }
    }

    render() {
        /* if((!this.state.dataRead) && this.props.dataAvail) {
            this.readItems();
            this.setState({dataRead: true})
        } */

        /* if((this.props.type === -1) && (this.state.Items.length === 0)) {
            this.setState({ Items: this.props.items });
        } */
    
        return (
            <Container
                id={this.props.id}
                className={this.props.className}
                type={this.props.type}
                char='i'
                dropFunc={this.addItem}
                dragFunc={this.removeItem}
                items={this.state.Items}
            >
                {this.props.children}
            </Container>
        );
    }
}

export default ItemBox;