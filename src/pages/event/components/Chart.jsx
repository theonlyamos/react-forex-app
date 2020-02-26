import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { isMobile } from '../../../common/utils/mobile-check.util';
import { formatTime } from '../../../common/utils/formatters';

import './Chart.css';

class Chart extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { chartWidth: this.chartWidth };
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => this.setState({ chartWidth: this.chartWidth });

  get data() {
    const { chart } = this.props;
    let i = 0;

    return chart.data.map(({ time, price }, index) => ({
      name: formatTime(index === 0 ? 0 : (i += chart.tick), true),
      price,
    }));
  }

  get chartWidth() {
    return window.innerWidth + this.props.chart.data.length * (isMobile ? 10 : 1) - (isMobile ? 0 : 320);
  }

  get ticks() {
    const { maxPrice, minPrice } = this.props.chart;
    const scale = Number(parseFloat(maxPrice - minPrice).toFixed(10));
    const min = Number(parseFloat(minPrice).toFixed(5));
    const max = Number(parseFloat(maxPrice).toFixed(5));
    const ticks = [min];

    let i = 0;
    let length = this.props.chart.data.length;

    while (length--) {
      const nextTick = Number(parseFloat(minPrice + (i += 0.2) * scale).toFixed(5));

      if (nextTick > max) {
        break;
      }

      ticks.push(nextTick);
    }
    ticks.push(max);

    return ticks;
  }

  render() {
    const isChartData = this.props.chart.data.length > 0;

    if (!isChartData) {
      return false;
    }

    const { maxPrice, minPrice } = this.props.chart;

    return (
      <div className="chart">
        <div className="chart-content">
          <div className="chart-header">
            <div>
              <strong>Start Price:</strong>
              {'   '}
              <span>{this.props.chart.data[0].price}</span>
            </div>
            <div>
              <strong>Last Price:</strong>
              {'   '}
              <span>{this.props.chart.data[this.props.chart.data.length - 1].price}</span>
            </div>
          </div>
          <LineChart
            width={this.state.chartWidth}
            height={isMobile ? 300 : 400}
            data={this.data}
            margin={{ top: isMobile ? 20 : 30, right: 20, left: isMobile ? 10 : 30, bottom: 0 }}
          >
            <XAxis dataKey="name" />
            <YAxis domain={[Number(minPrice), Number(maxPrice)]} ticks={this.ticks} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotoneX" dataKey="price" stroke="#82ca9d" />
          </LineChart>
        </div>
      </div>
    );
  }
}

export default Chart;
