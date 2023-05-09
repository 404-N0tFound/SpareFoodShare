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
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

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
        const charts = document.querySelectorAll('.admin_stats-page');
        const pdfDoc = new jsPDF('portrait', 'pt', 'a4');
        const promises = [];
        charts.forEach((chart) => {
            promises.push(
                html2canvas(chart, {
                    scale: 0.85,
                    useCORS: true,
                    allowTaint: true,
                }).then((canvas) => {
                    return canvas;
                })
            );
        });
        Promise.all(promises).then((canvases) => {
            canvases.forEach((canvas, index) => {
                if (index !== 0) {
                    pdfDoc.addPage();
                }
                const imgData = canvas.toDataURL('image/jpeg', 1.0);
                pdfDoc.addImage(imgData, 'JPEG', -75, 0, canvas.width / 2, canvas.height / 2);

                const data1 = [['Day', 'New Users'],
                    [`${this.state.new_users_week[0].name}`, `${this.state.new_users_week[0]['New Users']}`],
                    [`${this.state.new_users_week[1].name}`, `${this.state.new_users_week[1]['New Users']}`],
                    [`${this.state.new_users_week[2].name}`, `${this.state.new_users_week[2]['New Users']}`],
                    [`${this.state.new_users_week[3].name}`, `${this.state.new_users_week[3]['New Users']}`],
                    [`${this.state.new_users_week[4].name}`, `${this.state.new_users_week[4]['New Users']}`],
                    [`${this.state.new_users_week[5].name}`, `${this.state.new_users_week[5]['New Users']}`],
                    [`${this.state.new_users_week[6].name}`, `${this.state.new_users_week[6]['New Users']}`]
                ];
                const options1 = { startY: 440 };
                pdfDoc.autoTable({ head: [data1[0]], body: data1.slice(1), ...options1 });

                const data2 = [['Month', 'New Users'],
                    [`${this.state.new_users_month[0].name}`, `${this.state.new_users_month[0]['New Users']}`],
                    [`${this.state.new_users_month[1].name}`, `${this.state.new_users_month[1]['New Users']}`],
                    [`${this.state.new_users_month[2].name}`, `${this.state.new_users_month[2]['New Users']}`],
                    [`${this.state.new_users_month[3].name}`, `${this.state.new_users_month[3]['New Users']}`],
                    [`${this.state.new_users_month[4].name}`, `${this.state.new_users_month[4]['New Users']}`],
                    [`${this.state.new_users_month[5].name}`, `${this.state.new_users_month[5]['New Users']}`]
                ];
                const options2 = { startY: 620 };
                pdfDoc.autoTable({ head: [data2[0]], body: data2.slice(1), ...options2 });

                pdfDoc.addPage()
                const data3 = [['Individual Users', 'Business Users'], [`${this.state.user_ratio[0].value}`, `${this.state.user_ratio[1].value}`]];
                const options3 = { startY: 50 };
                pdfDoc.autoTable({ head: [data3[0]], body: data3.slice(1), ...options3 });

                const data4 = [['Day', 'Shares'],
                    [`${this.state.shared_week[0].name}`, `${this.state.shared_week[0]['Site-wide Shares']}`],
                    [`${this.state.shared_week[1].name}`, `${this.state.shared_week[1]['Site-wide Shares']}`],
                    [`${this.state.shared_week[2].name}`, `${this.state.shared_week[2]['Site-wide Shares']}`],
                    [`${this.state.shared_week[3].name}`, `${this.state.shared_week[3]['Site-wide Shares']}`],
                    [`${this.state.shared_week[4].name}`, `${this.state.shared_week[4]['Site-wide Shares']}`],
                    [`${this.state.shared_week[5].name}`, `${this.state.shared_week[5]['Site-wide Shares']}`],
                    [`${this.state.shared_week[6].name}`, `${this.state.shared_week[6]['Site-wide Shares']}`]
                ];
                const options4 = { startY: 100 };
                pdfDoc.autoTable({ head: [data4[0]], body: data4.slice(1), ...options4 });

                const data5 = [['Month', 'Shares'],
                    [`${this.state.shared_month[0].name}`, `${this.state.shared_month[0]['Site-wide Shares']}`],
                    [`${this.state.shared_month[1].name}`, `${this.state.shared_month[1]['Site-wide Shares']}`],
                    [`${this.state.shared_month[2].name}`, `${this.state.shared_month[2]['Site-wide Shares']}`],
                    [`${this.state.shared_month[3].name}`, `${this.state.shared_month[3]['Site-wide Shares']}`],
                    [`${this.state.shared_month[4].name}`, `${this.state.shared_month[4]['Site-wide Shares']}`],
                    [`${this.state.shared_month[5].name}`, `${this.state.shared_month[5]['Site-wide Shares']}`]
                ];
                const options5 = { startY: 280 };
                pdfDoc.autoTable({ head: [data5[0]], body: data5.slice(1), ...options5 });

                const data6 = [['Day', 'Perished Items'],
                    [`${this.state.perished_week[0].name}`, `${this.state.perished_week[0]['Perished Items']}`],
                    [`${this.state.perished_week[1].name}`, `${this.state.perished_week[1]['Perished Items']}`],
                    [`${this.state.perished_week[2].name}`, `${this.state.perished_week[2]['Perished Items']}`],
                    [`${this.state.perished_week[3].name}`, `${this.state.perished_week[3]['Perished Items']}`],
                    [`${this.state.perished_week[4].name}`, `${this.state.perished_week[4]['Perished Items']}`],
                    [`${this.state.perished_week[5].name}`, `${this.state.perished_week[5]['Perished Items']}`],
                    [`${this.state.perished_week[6].name}`, `${this.state.perished_week[6]['Perished Items']}`]
                ];
                const options6 = { startY: 440 };
                pdfDoc.autoTable({ head: [data6[0]], body: data6.slice(1), ...options6 });

                const data7 = [['Month', 'Perished Items'],
                    [`${this.state.perished_month[0].name}`, `${this.state.perished_month[0]['Perished Items']}`],
                    [`${this.state.perished_month[1].name}`, `${this.state.perished_month[1]['Perished Items']}`],
                    [`${this.state.perished_month[2].name}`, `${this.state.perished_month[2]['Perished Items']}`],
                    [`${this.state.perished_month[3].name}`, `${this.state.perished_month[3]['Perished Items']}`],
                    [`${this.state.perished_month[4].name}`, `${this.state.perished_month[4]['Perished Items']}`],
                    [`${this.state.perished_month[5].name}`, `${this.state.perished_month[5]['Perished Items']}`]
                ];
                const options7 = { startY: 620 };
                pdfDoc.autoTable({ head: [data7[0]], body: data7.slice(1), ...options7 });
            });
            pdfDoc.save('SiteStatistics.pdf');
        });
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
                        <div className="chart-empty"></div>
                        <div className="chart-empty">
                            <button onClick={this.generatePDF} type="button" className="export-pdf">Export PDF</button>
                        </div>
                        <div className="chart-empty"></div>
                    </div>
                </div>
                </body>
                <Footer id="foot_id"/>
            </div>
        );
    }
}

export default AdminStats;