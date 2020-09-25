import React from 'react';
import { Calendar, Radio, Col, Row, Select, Spin, Timeline } from 'antd';
import 'antd/dist/antd.css'
import "antd/lib/calendar/style/index.less";
import moment from 'moment';
import format from 'date-fns/format';
import * as Vibrant from 'node-vibrant'
import {
    API_URL,
    API_KEY,
    IMAGE_BASE_URL,
    BACKDROP_SIZE,
    POSTER_SIZE
} from "../util/config";
import axios from "axios";
import ColorThief from "colorthief";

const SCalendar = () => {
    const imgRef = React.createRef();
    const [state, setState] = React.useState({
        media: [],
        totalResult: 0,
        totalPages: 0,
        loading: false,
        type: 0,
    })
    const handleSelect = (e) => {
        console.log('e in select', format(e._d, 'yyyy-MM-dd'));
        initFetch('discover', { date: format(e._d, 'yyyy-MM-dd') });
        // getImageColor();
    }

    // const getImageColor = () => {
    //     Vibrant.from(require('../assets/ax.jpeg')).getPalette()
    //         .then((palette) => console.log(palette.DarkMuted._rgb, palette.DarkVibrant._rgb, palette.LightMuted._rgb, palette.LightVibrant._rgb, palette.Muted._rgb, palette.Vibrant._rgb))

    // }

    const initFetch = (type, input) => {
        const endPointTodayAiring = `${API_URL}tv/airing_today?api_key=${API_KEY}&language=en-US`;
        setState({ loading: true });
        switch (type) {
            case 'discover':
                fetchItems(`${API_URL}discover/tv?api_key=${API_KEY}&language=en-US&air_date.gte=${input.date}&air_date.lte=${input.date}`);
                break;
            case 'getNetwork':
                fetchItems(`${API_URL}tv/${input.tvId}?api_key=${API_KEY}&language=en-US`);
                break;
            default:
                break;
        }
    }

    const fetchItems = endpoint => {
        axios.get(endpoint).then(result => {
            console.log(result);
            console.log(result.data.results.filter(item => item.origin_country.indexOf('US') !== -1));
            setState({
                media: [...result.data.results.filter(item => item.origin_country.indexOf('US') !== -1)],
                loading: false,
                type: endpoint.indexOf("tv") === 29 ? "series" : "movie"
            });

            state.media.length !== 0 && console.log("state", state);
        });
    };

    const handleHeaderRender = ({ value, type, onChange, onTypeChange }) => {
        const start = 0;
        const end = 12;
        const monthOptions = [];

        const current = value.clone();
        const localeData = value.localeData();
        const months = [];
        for (let i = 0; i < 12; i++) {
            current.month(i);
            months.push(localeData.monthsShort(current));
        }

        for (let index = start; index < end; index++) {
            monthOptions.push(
                <Select.Option className="month-item" key={`${index}`}>
                    {months[index]}
                </Select.Option>,
            );
        }
        const month = value.month();

        const year = value.year();
        const options = [];
        for (let i = year - 10; i < year + 10; i += 1) {
            options.push(
                <Select.Option key={i} value={i} className="year-item">
                    {i}
                </Select.Option>,
            );
        }

        return (
            <Row >
                <Col>
                    <Select
                        size="small"
                        dropdownMatchSelectWidth={false}
                        className="my-year-select"
                        onChange={newYear => {
                            const now = value.clone().year(newYear);
                            onChange(now);
                        }}
                        value={String(year)}
                    >
                        {options}
                    </Select>
                </Col>
                <Col>
                    <Select
                        size="small"
                        dropdownMatchSelectWidth={false}
                        value={String(month)}
                        onChange={selectedMonth => {
                            const newValue = value.clone();
                            newValue.month(parseInt(selectedMonth, 10));
                            onChange(newValue);
                        }}
                    >
                        {monthOptions}
                    </Select>
                </Col>
            </Row>
        );
    }
    return (
        <div className="calendar-root-container">
            <Spin spinning={state.loading} wrapperClassName="spin-controller" >
                <div className="calendar-container">
                    <div className="calendar-container-1">
                        <Calendar fullscreen={true} onSelect={e => handleSelect(e)} headerRender={e => handleHeaderRender(e)} />
                    </div>
                </div>
                <div className="saeed" style={{ marginTop: '200px', width: '500px' }}>salam
                {/* <img crossOrigin={"anonymous"}
                        ref={imgRef} src={require("../assets/ax.jpeg")} onLoad={() => {
                            const colorThief = new ColorThief();
                            const img = imgRef.current;
                            const result = colorThief.getColor(img, 25);
                            const result1 = colorThief.getPalette(img, 25);
                            console.log(result1);
                        }} /> */}
                    {state.media && state.media.map(tt => (
                        <div key={tt.id}>
                            <div>{tt.name}</div>
                            <img src={`${IMAGE_BASE_URL}${POSTER_SIZE}${tt.poster_path}`} />
                            {/* <img src={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${tt.backdrop_path}`} /> */}
                        </div>

                    ))}

                    <Timeline>
                        <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
                        <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
                        <Timeline.Item>Technical testing 2015-09-01</Timeline.Item>
                        <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item>
                    </Timeline>
                </div>
            </Spin>
            <div className="calendar-container-footer"></div>
        </div>
    );
}

export default SCalendar;