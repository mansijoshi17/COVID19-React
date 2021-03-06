import React from 'react';

import { FetchStates, getStateName } from '../Actions/index';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { TwitterTimelineEmbed } from 'react-twitter-embed';

const google = window.google;

class State extends React.Component {

    componentDidMount() {
        this.props.FetchStates();
    }

    render() {

        var obj = { ...this.props.StatesList };
        var result = Object.keys(obj).map(function (key) {
            return [obj[key].state, parseInt(obj[key].confirmed)];
        });

        result = [["State", "Confirmed"]].concat(result);

        google.load('visualization', '1', { 'packages': ['geochart'], 'mapsApiKey': 'AIzaSyDQo9BVmkoP_2mbsi9n42b0fNMTFl7hKPQ' });
        google.setOnLoadCallback(drawVisualization);

        function drawVisualization() {
            var data = google.visualization.arrayToDataTable(result);

            var opts = {
                region: 'IN',
                displayMode: 'regions',
                resolution: 'provinces',
                datalessRegionColor: 'transparent',
                width: 700,
                height: 480,
                colorAxis: { colors: ['rgb(255, 245, 240)', 'rgb(253, 213, 195)', 'rgb(252, 164, 135)', 'rgb(250, 112, 81)', 'rgb(232, 56, 44)', 'rgb(187, 21, 26)'] },
            };
            var geochart = new google.visualization.GeoChart(
                document.getElementById('visualization'));
            geochart.draw(data, opts);
        };



        return (
            <div>
                <div className="row">
                    <div className="col-md-6 pl-5">
                        <table className="table table-sm">
                            <thead>
                                <tr>
                                    <th scope="col">STATE</th>
                                    <th scope="col">CONFIRMED</th>
                                    <th scope="col">ACTIVE</th>
                                    <th scope="col">RECOVERED</th>
                                    <th scope="col">DECEASED</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.StatesList ? this.props.StatesList.filter(state => this.props.search === "" || state.state.toLowerCase().includes(this.props.search)).map((state, index) => {
                                    return <tr key={index}>
                                        <th scope="row" onClick={() => { this.props.getStateName(state.state) }} style={{ cursor: 'pointer' }}><Link to={"/district"}>{state.state}</Link></th>
                                        <td>{state.confirmed}</td>
                                        <td>{state.active}</td>
                                        <td>{state.recovered}</td>
                                        <td>{state.deaths}</td>
                                    </tr>
                                }) : null}
                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-6">
                        <h1>INDIA MAP</h1>
                        <div id="visualization"> </div>
                        <div className="mt-5">
                            <TwitterTimelineEmbed
                                sourceType="profile"
                                screenName="COVID19Tracking"
                                options={{ height: 600, width: 500 }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        StatesList: state.StatesList
    }
}


export default connect(mapStateToProps, { FetchStates, getStateName })(State);