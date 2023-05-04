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
import jsPDF from 'jspdf';

class AdminStats extends PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            user_ratio: [],
            shared_week: [],
            shared_month: [],
            perished_week: [],
            perished_month: [],
            new_users_week: [],
            new_users_month: []
        };
    }

    componentDidMount() {
        this.loadStatistics().then({});
    }

    loadStatistics = async () => {
        this.setState({loading: true}, async () => {
            let jwt = 0;
            try {
                jwt = JSON.parse(localStorage.getItem('authTokens')).access;
                /* eslint-disable no-empty */
            } catch (ignored) {}
            /* eslint-enable */
            let response = await fetch(`http://127.0.0.1:8000/api/stats/?jwt=${jwt}`, {
                method:'GET'
            })
            let data = await response.json()
            if (response.status === 200) {
                this.setState({
                    loading: false,
                    user_ratio: [...data.user_ratio],
                    shared_week: [...data.shared_week],
                    shared_month: [...data.shared_month],
                    perished_week: [...data.perished_week],
                    perished_month: [...data.perished_month],
                    new_users_week: [...data.new_users_week],
                    new_users_month: [...data.new_users_month],
                });
            } else {
                alert('Statistics service failed! Is it maybe down?');
            }
        })
    }

    generatePDF = () => {
        const report = new jsPDF('portrait','pt','a4');
        report.html(document.querySelector('.admin_stats-page')).then(() => {
            report.save('report.pdf');
        })
    };

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
                                        data={this.state.user_ratio}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={this.renderCustomizedLabel}
                                        outerRadius={150}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {this.state.user_ratio.map((entry, index) => (
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
                                    <BarChart className="shared-weekly-chart" data={this.state.shared_week}>
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
                                    <BarChart className="shared-weekly-chart" data={this.state.shared_month}>
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
                                    <BarChart className="shared-weekly-chart" data={this.state.perished_week}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="Perished Items" fill="#d82ad5"/>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="chart-background">
                            <p>Perished Items Last 6 Months</p>
                            <div className="chart-container">
                                <ResponsiveContainer width={400} height={325}>
                                    <BarChart className="shared-weekly-chart" data={this.state.perished_month}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="Perished Items" fill="#d87825"/>
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
                                        data={this.state.new_users_week}
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
                                        data={this.state.new_users_month}
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
                <button onClick={this.generatePDF} type="button" className="export-pdf">Export PDF</button>
                </body>
                <Footer id="foot_id"/>
            </div>
        );
    }
}

export default AdminStats;