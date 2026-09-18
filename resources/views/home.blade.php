@extends('layouts.admin')
@section('content-header', '')
@section('content')
<style>
    /* Luxury Dashboard Design System */
    .dashboard-container {
        padding: 0 0 24px;
    }

    .welcome-banner {
        background: #ffffff;
        border-radius: 20px;
        padding: 22px 26px;
        margin-bottom: 24px;
        border: 1.5px solid #d0e4f5;
        box-shadow: 0 10px 30px rgba(42, 105, 176, 0.08);
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 16px;
    }

    .welcome-title h2 {
        font-size: 1.55rem;
        font-weight: 600;
        color: #1a1a1a;
        margin: 0 0 4px;
        letter-spacing: -0.03em;
    }

    .welcome-title p {
        margin: 0;
        font-size: 0.88rem;
        color: #2a69b0;
    }

    .quick-actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
    }

    .btn-quick-action {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 18px;
        border-radius: 12px;
        font-size: 0.84rem;
        font-weight: 600;
        text-decoration: none !important;
        transition: all 0.2s ease;
    }

    .btn-pos-quick {
        background: #2a69b0;
        color: #ffffff !important;
        box-shadow: 0 6px 18px rgba(42, 105, 176, 0.38);
    }
    .btn-pos-quick:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(42, 105, 176, 0.5);
    }

    .btn-secondary-quick {
        background: #f0f6ff;
        color: #2a69b0 !important;
        border: 1.5px solid #d0e4f5;
    }
    .btn-secondary-quick:hover {
        background: #e8f2fb;
        border-color: #2a69b0;
        color: #2a69b0 !important;
        transform: translateY(-2px);
    }

    /* ''‚''‚¬ Metric Cards ''‚''‚¬ */
    .metric-card {
        border-radius: 20px;
        padding: 22px;
        color: #ffffff;
        position: relative;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .metric-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 14px 34px rgba(42, 105, 176, 0.2);
    }

    .metric-card.card-today {
        background: #ffffff;
        border: 1.5px solid rgba(42, 105, 176, 0.3);
        color: #1a1a1a;
    }

    .metric-card.card-week {
        background: #ffffff;
        border: 1.5px solid rgba(42, 105, 176, 0.3);
        color: #1a1a1a;
    }

    .metric-card.card-month {
        background: #ffffff;
        border: 1.5px solid rgba(42, 105, 176, 0.3);
        color: #1a1a1a;
    }

    .metric-card.card-customers {
        background: #ffffff;
        border: 1.5px solid rgba(42, 105, 176, 0.3);
        color: #1a1a1a;
    }

    .metric-card.card-week h3,
    .metric-card.card-week p,
    .metric-card.card-customers h3,
    .metric-card.card-customers p {
        color: #1a1a1a;
    }

    .metric-card.card-week .icon-bubble, .metric-card.card-today .icon-bubble,.metric-card.card-customers .icon-bubble,
    .metric-card.card-month .icon-bubble {
        background: #e8f2fb;
        color: #2a69b0;
    }

    .metric-card.card-week .metric-pill, .metric-card.card-today .metric-pill, .metric-card.card-customers .metric-pill,
    .metric-card.card-month .metric-pill {
        background: #e8f2fb;
        color: #2a69b0;
    }

    .metric-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
    }

    .metric-header .icon-bubble {
        width: 44px;
        height: 44px;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.22);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
    }

    .metric-pill {
        padding: 4px 12px;
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.22);
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.04em;
        text-transform: uppercase;
    }

    .metric-card h3 {
        font-size: 1.7rem;
        font-weight: 600;
        margin: 0 0 4px;
        letter-spacing: -0.02em;
    }

    .metric-card p {
        margin: 0;
        font-size: 0.88rem;
        opacity: 0.92;
        font-weight: 500;
    }

    /* ''‚''‚¬ Standard Widget Card ''‚''‚¬ */
    .widget-card {
        background: #ffffff;
        border-radius: 20px;
        border: 1.5px solid #d0e4f5;
        box-shadow: 0 10px 30px rgba(42, 105, 176, 0.06);
        margin-bottom: 24px;
        overflow: hidden;
    }

    .widget-header {
        padding: 18px 22px;
        border-bottom: 1px solid #f5eedf;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #ffffff;
    }

    .widget-header h4 {
        margin: 0;
        font-size: 1.05rem;
        font-weight: 600;
        color: #1a1a1a;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .widget-header .badge-tag {
        font-size: 0.72rem;
        font-weight: 500;
        background: #f0f6ff;
        color: #2a69b0;
        border: 1px solid #d0e4f5;
        padding: 4px 10px;
        border-radius: 8px;
    }

    .chart-container-lg {
        height: 320px;
        padding: 18px 20px;
        position: relative;
    }

    .chart-container-sm {
        height: 320px;
        padding: 18px 20px;
        position: relative;
    }

    /* ''‚''‚¬ Data Tables ''‚''‚¬ */
    .table-modern {
        margin-bottom: 0;
    }

    .table-modern thead th {
        background: #f0f6ff;
        color: #2a69b0;
        font-size: 0.74rem;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        border-top: none;
        border-bottom: 1px solid #d0e4f5;
        padding: 12px 18px;
    }

    .table-modern tbody td {
        padding: 14px 18px;
        font-size: 0.86rem;
        color: #1a1a1a;
        vertical-align: middle;
        border-bottom: 1px solid #f8f6f0;
    }

    .table-modern tbody tr:last-child td {
        border-bottom: none;
    }

    .table-modern tbody tr:hover {
        background-color: #f0f6ff;
    }

    .avatar-badge {
        width: 34px;
        height: 34px;
        border-radius: 10px;
        background: #f0f6ff;
        border: 1px solid #d0e4f5;
        color: #2a69b0;
        font-weight: 600;
        font-size: 0.82rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
    }

    .status-pill {
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 0.72rem;
        font-weight: 500;
        letter-spacing: 0.02em;
        display: inline-block;
    }

    .status-pill.paid {
        background: #ecfdf5;
        color: #059669;
        border: 1px solid #a7f3d0;
    }

    .status-pill.srb {
        background: #f0f6ff;
        color: #2a69b0;
        border: 1px solid #d0e4f5;
        font-size: 0.7rem;
    }

    .progress-bar-custom {
        height: 6px;
        border-radius: 4px;
        background: #d0e4f5;
        overflow: hidden;
        margin-top: 6px;
    }

    .progress-fill-orange {
        height: 100%;
        background: #2a69b0;
        border-radius: 4px;
    }

    .summary-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 13px 0;
        border-bottom: 1px solid #f8f6f0;
    }
    .summary-item:last-child {
        border-bottom: none;
    }
    .summary-item .label {
        font-size: 0.86rem;
        color: #2a69b0;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .summary-item .value {
        font-size: 0.95rem;
        font-weight: 600;
        color: #1a1a1a;
    }
</style>

<div class="dashboard-container">

    {{-- ''‚''‚¬ 1. Welcome & Quick Action Header ''‚''‚¬ --}}
    <div class="welcome-banner">
        <div class="welcome-title">
            <h2>Welcome back, {{ auth()->user()->first_name ?? 'Admin' }}!</h2>
            <p>Here's a comprehensive overview of your sales performance, orders, and real-time inventory.</p>
        </div>
        <div class="quick-actions">
            <a href="{{ route('cart.index') }}" class="btn-quick-action btn-pos-quick">
                <x-snd-icon name="shopping-cart" /> Open POS Terminal
            </a>
            <a href="{{ route('products.create') }}" class="btn-quick-action btn-secondary-quick">
                <x-snd-icon name="plus" /> Add Product
            </a>
            <a href="{{ route('customers.create') }}" class="btn-quick-action btn-secondary-quick">
                <x-snd-icon name="user-plus" /> New Customer
            </a>
            <a href="{{ route('orders.index') }}" class="btn-quick-action btn-secondary-quick">
                <x-snd-icon name="receipt" /> Orders List
            </a>
        </div>
    </div>

    {{-- ''‚''‚¬ 2. Top Metric Cards ''‚''‚¬ --}}
    <div class="row g-3 mb-4">
        <div class="col-xl-3 col-md-6 mb-3 mb-xl-0">
            <div class="metric-card card-today">
                <div class="metric-header">
                    <div class="icon-bubble"><x-snd-icon name="zap" /></div>
                    <span class="metric-pill">Daily Revenue</span>
                </div>
                <div>
                    <h3>{{ config('settings.currency_symbol') }} {{ number_format($sales_today, 2) }}</h3>
                    <p>Today's Sales ({{ $orders_today }} orders)</p>
                </div>
            </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-3 mb-xl-0">
            <div class="metric-card card-week">
                <div class="metric-header">
                    <div class="icon-bubble" style="background: rgba(42,105,176,0.2);"><x-snd-icon name="chart-line" style="color: #2a69b0;" /></div>
                    <span class="metric-pill" style="background: rgba(42,105,176,0.2); color: #2a69b0;">This Week</span>
                </div>
                <div>
                    <h3>{{ config('settings.currency_symbol') }} {{ number_format($sales_week, 2) }}</h3>
                    <p>Weekly Volume ({{ $orders_week }} orders)</p>
                </div>
            </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-3 mb-xl-0">
            <div class="metric-card card-month">
                <div class="metric-header">
                    <div class="icon-bubble"><x-snd-icon name="calendar-days" /></div>
                    <span class="metric-pill">{{ $mom_growth >= 0 ? '+' : '' }}{{ $mom_growth }}% MoM</span>
                </div>
                <div>
                    <h3>{{ config('settings.currency_symbol') }} {{ number_format($sales_month, 2) }}</h3>
                    <p>Monthly Sales ({{ $orders_month }} orders)</p>
                </div>
            </div>
        </div>

        <div class="col-xl-3 col-md-6">
            <div class="metric-card card-customers">
                <div class="metric-header">
                    <div class="icon-bubble" style="background: rgba(42,105,176,0.2);"><x-snd-icon name="users" style="color: #2a69b0;" /></div>
                    <span class="metric-pill" style="background: rgba(42,105,176,0.2); color: #2a69b0;">Customer Hub</span>
                </div>
                <div>
                    <h3>{{ $customers_count }} Registered</h3>
                    <p>{{ $orders_count }} Total Completed Orders</p>
                </div>
            </div>
        </div>
    </div>

    {{-- ''‚''‚¬ 3. Visual Charts Row ''‚''‚¬ --}}
    <div class="row">
        {{-- Main Revenue & Order Trends --}}
        <div class="col-lg-8">
            <div class="widget-card">
                <div class="widget-header">
                    <h4><x-snd-icon name="chart-area" style="color: #2a69b0;" /> 12-Month Revenue & Orders Trajectory</h4>
                    <span class="badge-tag">Past 12 Months Analytics</span>
                </div>
                <div class="chart-container-lg">
                    <canvas id="monthlySalesChart"></canvas>
                </div>
            </div>
        </div>

        {{-- Service & Product Breakdown --}}
        <div class="col-lg-4">
            <div class="widget-card">
                <div class="widget-header">
                    <h4><x-snd-icon name="chart-pie" style="color: #2a69b0;" /> Category & Service Share</h4>
                    <span class="badge-tag">Volume Distribution</span>
                </div>
                <div class="chart-container-sm">
                    <canvas id="serviceSalesChart"></canvas>
                </div>
            </div>
        </div>
    </div>

    {{-- ''‚''‚¬ 4. Real-time Operations Row ''‚''‚¬ --}}
    <div class="row">
        {{-- Recent Orders Feed --}}
        <div class="col-lg-7">
            <div class="widget-card">
                <div class="widget-header">
                    <h4><x-snd-icon name="shopping-bag" style="color: #2a69b0;" /> Latest Transactions</h4>
                    <a href="{{ route('orders.index') }}" class="btn btn-xs" style="background: #f0f6ff; border: 1px solid #d0e4f5; color: #2a69b0; border-radius: 8px; font-weight: 500;">View All Orders</a>
                </div>
                <div class="table-responsive snd-table-scroll">
                    <table class="table table-modern">
                        <thead>
                            <tr>
                                <th>Invoice</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($recent_orders as $ord)
                                <tr>
                                    <td>
                                        <span style="font-weight: 500; color: #1a1a1a;">#ORD-{{ $ord->id }}</span>
                                        @if($ord->srb_invoice_id)
                                            <div class="status-pill srb">{{ $ord->srb_invoice_id }}</div>
                                        @endif
                                    </td>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <div class="avatar-badge">
                                                {{ strtoupper(substr($ord->customer->first_name ?? 'Walk-in', 0, 1)) }}
                                            </div>
                                            <div>
                                                <div style="font-weight: 600; color: #1a1a1a;">
                                                    {{ $ord->customer ? $ord->customer->first_name . ' ' . $ord->customer->last_name : 'Walk-in Customer' }}
                                                </div>
                                                <small style="color: #2a69b0;">{{ $ord->customer->phone ?? '' }}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span class="badge badge-light" style="font-size: 0.8rem; font-weight: 600; background: #f0f6ff; border: 1px solid #d0e4f5; color: #2a69b0;">{{ $ord->items->sum('quantity') }} items</span>
                                    </td>
                                    <td>
                                        <strong style="color: #2a69b0; font-size: 0.92rem; font-weight: 600;">
                                            {{ config('settings.currency_symbol') }} {{ number_format($ord->total_amount, 2) }}
                                        </strong>
                                    </td>
                                    <td>
                                        <span class="status-pill paid"><x-snd-icon name="circle-check" class="mr-1" /> Paid</span>
                                    </td>
                                    <td style="color: #2a69b0; font-size: 0.8rem;">
                                        {{ $ord->created_at ? $ord->created_at->format('d M, h:i A') : '' }}
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="6" class="text-center py-4 text-muted">No recent transactions recorded</td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {{-- Top Selling & Inventory Health --}}
        <div class="col-lg-5">
            <div class="widget-card">
                <div class="widget-header">
                    <h4><x-snd-icon name="flame" style="color: #2a69b0;" /> Top Selling Items</h4>
                    <span class="badge-tag">High Demand</span>
                </div>
                <div class="p-3">
                    @forelse($top_selling_items as $item)
                        <div class="mb-3">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <span style="font-weight: 600; font-size: 0.88rem; color: #1a1a1a;">{{ $item['name'] }}</span>
                                <span style="font-weight: 500; font-size: 0.86rem; color: #2a69b0;">{{ $item['quantity'] }} sold</span>
                            </div>
                            <div class="progress-bar-custom">
                                <div class="progress-fill-orange" style="width: {{ min(100, max(20, $item['quantity'] * 2)) }}%;"></div>
                            </div>
                        </div>
                    @empty
                        <div class="text-center py-4 text-muted">No sales items recorded</div>
                    @endforelse
                </div>

                @if($low_stock_products->isNotEmpty())
                    <div class="p-3 border-top" style="background: #f0f6ff;">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                        <span style="font-size: 0.82rem; font-weight: 600; color: #dc2626;"><x-snd-icon name="triangle-alert" class="mr-1" /> Low Stock Alert</span>
                            <a href="{{ route('products.index') }}" class="small" style="color: #dc2626; font-weight: 600;">Manage Inventory</a>
                        </div>
                        <div class="d-flex flex-wrap gap-2">
                            @foreach($low_stock_products as $lsp)
                                <span class="badge badge-danger p-2" style="border-radius: 6px; font-weight: 500; font-size: 0.76rem;">
                                    {{ $lsp->name }} ({{ $lsp->quantity }} left)
                                </span>
                            @endforeach
                        </div>
                    </div>
                @endif
            </div>
        </div>
    </div>

    {{-- ''‚''‚¬ 5. Financial Breakdown & POS Summary Row ''‚''‚¬ --}}
    <div class="row">
        {{-- Detailed Monthly Breakdown --}}
        <div class="col-lg-8">
            <div class="widget-card">
                <div class="widget-header">
                    <h4><x-snd-icon name="table" style="color: #2a69b0;" /> Monthly Financial Breakdown</h4>
                    <span class="badge-tag">Audited Log</span>
                </div>
                <div class="table-responsive snd-table-scroll">
                    <table class="table table-modern">
                        <thead>
                            <tr>
                                <th>Billing Month</th>
                                <th>Total Orders</th>
                                <th>Gross Revenue</th>
                                <th>Avg Ticket Value</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($monthly_sales as $month)
                                <tr>
                                    <td><strong>{{ $month['label'] }}</strong></td>
                                    <td><span class="badge badge-light" style="font-size: 0.82rem; font-weight: 600; background: #f0f6ff; border: 1px solid #d0e4f5; color: #2a69b0;">{{ $month['orders'] }} orders</span></td>
                                    <td><strong style="color: #1a1a1a;">{{ config('settings.currency_symbol') }} {{ number_format($month['sales'], 2) }}</strong></td>
                                    <td style="color: #2a69b0;">{{ config('settings.currency_symbol') }} {{ number_format($month['orders'] ? $month['sales'] / $month['orders'] : 0, 2) }}</td>
                                    <td>
                                        <span class="status-pill paid"><x-snd-icon name="check-check" class="mr-1" /> Closed</span>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {{-- Monthly POS Summary Metric Widget --}}
        <div class="col-lg-4">
            <div class="widget-card">
                <div class="widget-header">
                    <h4><x-snd-icon name="calculator" style="color: #2a69b0;" /> Current Month POS Audit</h4>
                    <span class="badge-tag">{{ now()->format('M Y') }}</span>
                </div>
                <div class="p-3">
                    <div class="summary-item">
                        <span class="label"><x-snd-icon name="box" style="color: #2a69b0;" /> Items Dispatched</span>
                        <span class="value">{{ number_format($pos_summary['items_sold']) }} units</span>
                    </div>
                    <div class="summary-item">
                        <span class="label"><x-snd-icon name="receipt" style="color: #2a69b0;" /> Average Basket Size</span>
                        <span class="value">{{ config('settings.currency_symbol') }} {{ number_format($pos_summary['average_order'], 2) }}</span>
                    </div>
                    <div class="summary-item">
                        <span class="label"><x-snd-icon name="percent" style="color: #2a69b0;" /> Tax Collected (SRB)</span>
                        <span class="value" style="color: #059669;">{{ config('settings.currency_symbol') }} {{ number_format($pos_summary['tax'], 2) }}</span>
                    </div>
                    <div class="summary-item">
                        <span class="label"><x-snd-icon name="tag" style="color: #2a69b0;" /> Discounts Claimed</span>
                        <span class="value" style="color: #2a69b0;">{{ config('settings.currency_symbol') }} {{ number_format($pos_summary['discount'], 2) }}</span>
                    </div>
                    <div class="summary-item" style="background: #f0f6ff; border: 1px solid #d0e4f5; padding: 12px 14px; border-radius: 12px; margin-top: 10px;">
                        <span class="label" style="font-weight: 600; color: #1a1a1a;"><x-snd-icon name="wallet" style="color: #2a69b0;" /> Total Net Inflow</span>
                        <span class="value" style="color: #2a69b0; font-size: 1.1rem; font-weight: 600;">{{ config('settings.currency_symbol') }} {{ number_format($sales_month, 2) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

</div>
@endsection

@section('js')
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', () => {
    const currency = @json(config('settings.currency_symbol'));
    const monthly = @json($monthly_sales);
    const services = @json($service_sales);

    // 1. Monthly Sales & Orders Combined Bar + Area Chart
    const ctxMonthly = document.getElementById('monthlySalesChart');
    if (ctxMonthly) {
        const labels = monthly.map(m => m.label);
        const salesData = monthly.map(m => m.sales);
        const ordersData = monthly.map(m => m.orders);

        new Chart(ctxMonthly, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Gross Sales (' + currency + ')',
                        data: salesData,
                        backgroundColor: 'rgba(151, 134, 238, 0.85)',
                        borderColor: '#9786ee',
                        borderWidth: 1,
                        borderRadius: 8,
                        barPercentage: 0.6,
                        yAxisID: 'ySales'
                    },
                    {
                        label: 'Orders Count',
                        data: ordersData,
                        type: 'line',
                        borderColor: '#806fda',
                        backgroundColor: 'rgba(151, 134, 238, 0.12)',
                        borderWidth: 3,
                        pointBackgroundColor: '#806fda',
                        pointBorderColor: '#ffffff',
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        tension: 0.38,
                        fill: true,
                        yAxisID: 'yOrders'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: { family: 'system-ui', size: 12, weight: '600' },
                            color: '#85899d',
                            usePointStyle: true,
                            boxWidth: 8
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(26, 26, 26, 0.94)',
                        titleFont: { family: 'system-ui', size: 13, weight: '700' },
                        bodyFont: { family: 'system-ui', size: 12 },
                        padding: 12,
                        cornerRadius: 10,
                        callbacks: {
                            label: function(context) {
                                if (context.dataset.yAxisID === 'ySales') {
                                    return 'Sales: ' + currency + ' ' + context.parsed.y.toLocaleString();
                                }
                                return 'Orders: ' + context.parsed.y + ' orders';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { font: { family: 'system-ui', size: 11 }, color: '#85899d' }
                    },
                    ySales: {
                        type: 'linear',
                        position: 'left',
                        beginAtZero: true,
                        grid: { color: '#eef0f7' },
                        ticks: {
                            font: { family: 'system-ui', size: 11 },
                            color: '#85899d',
                            callback: value => currency + ' ' + (value >= 1000 ? (value/1000) + 'k' : value)
                        }
                    },
                    yOrders: {
                        type: 'linear',
                        position: 'right',
                        beginAtZero: true,
                        grid: { drawOnChartArea: false },
                        ticks: {
                            font: { family: 'system-ui', size: 11 },
                            color: '#85899d',
                            stepSize: 10
                        }
                    }
                }
            }
        });
    }

    // 2. Category & Service Doughnut Chart
   const ctxService = document.getElementById('serviceSalesChart');
    if (ctxService) {
        const serviceKeys = Object.keys(services);
        const serviceValues = Object.values(services);

        const chartColors = [
            '#9786ee', '#806fda', '#6758bd', '#5ac8fa',
            '#34c759', '#ff9500', '#ff3b30', '#b2a6f4'
        ];

        new Chart(ctxService, {
            type: 'doughnut',
            data: {
                labels: serviceKeys,
                datasets: [{
                    data: serviceValues,
                    backgroundColor: chartColors.slice(0, serviceKeys.length),
                    borderWidth: 2,
                    borderColor: '#ffffff',
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '72%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: {
                                family: 'system-ui',
                                size: 11,
                                weight: '500'
                            },
                            color: '#85899d',
                            usePointStyle: true,
                            boxWidth: 8,
                            padding: 14
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(26, 26, 26, 0.94)',
                        padding: 12,
                        cornerRadius: 10,
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' +
                                    currency + ' ' +
                                    Number(context.parsed).toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
});
</script>
@endsection


