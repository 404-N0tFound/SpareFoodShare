import "../components/Theme.css";
import "./AdminStats.css";
import ProfileFramework from "../components/ProfileFramework";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {PureComponent} from "react";
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip} from 'recharts';

class AdminStats extends PureComponent{
    constructor(props) {
        super(props);
    }

    data = [
        { name: 'Individual Users', value: 60 },
        { name: 'Businesses Users', value: 40 }
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
                            <p>User Personal and Business Ratio</p>
                            <ResponsiveContainer minWidth="200px" minHeight="200px">
                                <PieChart className="user-ratio-chart">
                                    <Pie
                                        data={this.data}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={this.renderCustomizedLabel}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {this.data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={this.COLORS[index % this.COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
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
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {this.data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={this.COLORS[index % this.COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
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
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {this.data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={this.COLORS[index % this.COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
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
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {this.data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={this.COLORS[index % this.COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
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
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {this.data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={this.COLORS[index % this.COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
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