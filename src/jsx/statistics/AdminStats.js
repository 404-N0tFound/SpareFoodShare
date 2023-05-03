import "../components/Theme.css";
import "./AdminStats.css";
import ProfileFramework from "../components/ProfileFramework";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {PureComponent} from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    BarChart,
    CartesianGrid,
    XAxis,
    Legend, Bar, LineChart, Line
} from 'recharts';

class AdminStats extends PureComponent{
    constructor(props) {
        super(props);
    }

    data = [
        { name: 'Individual Users', value: 89234752847 },
        { name: 'Businesses Users', value: 84273509824 }
    ];
    data2 = [
        {
            name: 'Sunday',
            'Site-wide Shares': 8
        },
        {
            name: 'Monday',
            'Site-wide Shares': 1
        },
        {
            name: 'Tuesday',
            'Site-wide Shares': 4
        },
        {
            name: 'Wednesday',
            'Site-wide Shares': 0
        },
        {
            name: 'Thursday',
            'Site-wide Shares': 3
        },
        {
            name: 'Friday',
            'Site-wide Shares': 1
        },
        {
            name: 'Saturday',
            'Site-wide Shares': 5
        },
    ];
    data3 = [
        {
            name: 'Sunday',
            'New Users': 2
        },
        {
            name: 'Monday',
            'New Users': 0
        },
        {
            name: 'Tuesday',
            'New Users': 4
        },
        {
            name: 'Wednesday',
            'New Users': 1
        },
        {
            name: 'Thursday',
            'New Users': 1
        },
        {
            name: 'Friday',
            'New Users': 2
        },
        {
            name: 'Saturday',
            'New Users': 3
        },
    ];
    data4 = [
        {
            name: 'December',
            'New Users': 1
        },
        {
            name: 'January',
            'New Users': 9
        },
        {
            name: 'February',
            'New Users': 4
        },
        {
            name: 'March',
            'New Users': 5
        },
        {
            name: 'April',
            'New Users': 2
        },
        {
            name: 'May',
            'New Users': 11
        }
    ];
    COLORS = ['#0088FE', '#de1754'];
    renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.4;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    render() {
        return (
            <div className="page-content">
                <Navbar/>
                <body className="admin_stats-body">
                <ProfileFramework />
                <div className="admin_stats-page">
                    <div className="charts">
                        <div className="chart-background">
                            <p>User Personal and Business Ratio</p>
                            <ResponsiveContainer minWidth="200px" minHeight="200px">
                                <PieChart className="user-ratio-chart">
                                    <Pie
                                        data={this.data}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={this.renderCustomizedLabel}
                                        outerRadius={150}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {this.data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={this.COLORS[index % this.COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        separator=""
                                        formatter={(value, name) => [`${name}: ${value}`, '']}
                                        labelFormatter={() => ''}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="chart-background">
                            <p>Items Shared This Week</p>
                            <div className="chart-container">
                                <ResponsiveContainer width={400} height={325}>
                                    <BarChart className="shared-weekly-chart" data={this.data2}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="Site-wide Shares" fill="#37d856"/>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="chart-background">
                            <p>Items Shared Last 6 Months</p>
                            <div className="chart-container">
                                <ResponsiveContainer width={400} height={325}>
                                    <BarChart className="shared-weekly-chart" data={this.data2}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="Site-wide Shares" fill="#d4d815"/>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="chart-background">
                            <p>Perished Items Per Day</p>
                            <div className="chart-container">
                                <ResponsiveContainer width={400} height={325}>
                                    <BarChart className="shared-weekly-chart" data={this.data2}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="Site-wide Shares" fill="#d82ad5"/>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="chart-background">
                            <p>Perished Items Last 6 Months</p>
                            <div className="chart-container">
                                <ResponsiveContainer width={400} height={325}>
                                    <BarChart className="shared-weekly-chart" data={this.data2}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="Site-wide Shares" fill="#d87825"/>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="chart-background">
                            <p>New Users Rates</p>
                            <div className="chart-container">
                                <ResponsiveContainer width={400} height={150}>
                                    <LineChart
                                        className="new-users-weekly-chart"
                                        data={this.data3}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="New Users" stroke="#8884d8" activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                                <ResponsiveContainer width={400} height={175}>
                                    <LineChart
                                        className="new-users-weekly-chart"
                                        data={this.data4}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="New Users" stroke="#8884d8" activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
                </body>
                <Footer id="foot_id"/>
            </div>
        );
    }
}

export default AdminStats;