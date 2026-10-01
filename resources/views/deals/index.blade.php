@extends('layouts.admin')

@section('title', 'Deals Management')
@section('content-header', 'Deals Management')
@section('content-actions')
<a href="{{ route('deals.create') }}" class="btn btn-primary" style="font-weight: 700; border-radius: 10px; padding: 8px 18px;">
    <i class="fas fa-plus-circle mr-1"></i> Create New Deal
</a>
@endsection

@section('css')
<link rel="stylesheet" href="{{ asset('plugins/sweetalert2/sweetalert2.min.css') }}">
<style>
.deal-card-table th { background: rgba(247,248,252,.86); color: var(--snd-ink-soft); font-weight: 700; border-top: none; }
.badge-discount { background: #dcfce7; color: #15803d; font-weight: 800; font-size: 0.78rem; padding: 4px 10px; border-radius: 20px; border: 1px solid #bbf7d0; }
.badge-service-chip { background: var(--snd-primary-wash); color: var(--snd-primary-deep); border: 1px solid var(--snd-border-strong); font-size: 0.73rem; font-weight: 700; border-radius: 12px; padding: 2px 8px; margin: 2px; display: inline-block; }
.original-price { text-decoration: line-through; color: #94a3b8; font-weight: 600; font-size: 0.85rem; margin-right: 6px; }
.discounted-price { color: var(--snd-primary-deep); font-weight: 800; font-size: 1rem; }
</style>
@endsection

@section('content')
<div class="card" style="border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
    <div class="card-body p-4">
        <form method="GET" action="{{ route('deals.index') }}" class="form-inline mb-4">
            <div class="input-group" style="width: 320px;">
                <input type="text" name="search" class="form-control" placeholder="Search deals by name or barcode..." value="{{ request('search') }}" style="border-radius: 10px 0 0 10px; border: 1px solid #cbd5e1;">
                <div class="input-group-append">
                    <button type="submit" class="btn btn-primary" style="border-radius: 0 10px 10px 0;">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </div>
            @if(request('search'))
                <a href="{{ route('deals.index') }}" class="btn btn-link text-secondary ml-2"><i class="fas fa-times-circle"></i> Clear Filter</a>
            @endif
        </form>

        @if(session('success'))
            <div class="alert alert-success alert-dismissible fade show" role="alert" style="border-radius: 12px;">
                <i class="fas fa-check-circle mr-1"></i> {{ session('success') }}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        @endif

        <div class="table-responsive">
            <table class="table align-middle deal-card-table">
                <thead>
                    <tr>
                        <th style="width: 60px;">ID</th>
                        <th>Deal Name</th>
                        <th>Included Services</th>
                        <th>Before Price</th>
                        <th>After Discount</th>
                        <th>Discount Savings</th>
                        <th>Status</th>
                        <th class="text-right" style="width: 140px;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($deals as $deal)
                    <tr>
                        <td class="font-weight-bold text-secondary">#{{ $deal->id }}</td>
                        <td>
                            <div class="font-weight-bold text-dark" style="font-size: 0.95rem;">{{ $deal->name }}</div>
                            @if($deal->barcode)
                                <small class="text-muted"><i class="fas fa-barcode mr-1"></i>{{ $deal->barcode }}</small>
                            @endif
                            @if($deal->description)
                                <div class="text-muted small mt-1" style="max-width: 260px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ $deal->description }}</div>
                            @endif
                        </td>
                        <td>
                            <div style="max-width: 280px;">
                                @forelse($deal->services as $srv)
                                    <span class="badge-service-chip">
                                        <i class="fas fa-spa text-primary mr-1" style="font-size:0.65rem;"></i>{{ $srv->name }}
                                    </span>
                                @empty
                                    <span class="text-muted small">No services assigned</span>
                                @endforelse
                            </div>
                        </td>
                        <td>
                            <span class="original-price">{{ config('settings.currency_symbol') }} {{ number_format($deal->original_amount, 2) }}</span>
                        </td>
                        <td>
                            <span class="discounted-price">{{ config('settings.currency_symbol') }} {{ number_format($deal->discounted_amount, 2) }}</span>
                        </td>
                        <td>
                            @if($deal->discount_percentage > 0)
                                <span class="badge-discount">
                                    <i class="fas fa-percentage mr-1"></i>{{ number_format($deal->discount_percentage, 0) }}% OFF
                                </span>
                            @else
                                <span class="badge badge-light">Standard</span>
                            @endif
                        </td>
                        <td>
                            <span class="badge badge-{{ $deal->status ? 'success' : 'danger' }}" style="border-radius: 12px; padding: 5px 12px; font-weight: 700;">
                                {{ $deal->status ? 'Active' : 'Inactive' }}
                            </span>
                        </td>
                        <td class="text-right">
                            <a href="{{ route('deals.edit', $deal) }}" class="btn btn-sm btn-outline-primary mr-1" style="border-radius: 8px;" title="Edit Deal">
                                <i class="fas fa-edit"></i>
                            </a>
                            <button type="button" class="btn btn-sm btn-outline-danger btn-delete" data-url="{{ route('deals.destroy', $deal) }}" style="border-radius: 8px;" title="Delete Deal">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="8" class="text-center py-5 text-muted">
                            <i class="fas fa-tags fa-3x mb-3 text-light"></i>
                            <h5>No Deals Found</h5>
                            <p class="small">Click "Create New Deal" above to make special service combo packages.</p>
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <div class="mt-3">
            {{ $deals->render() }}
        </div>
    </div>
</div>
@endsection

@section('js')
<script src="{{ asset('plugins/sweetalert2/sweetalert2.min.js') }}"></script>
<script>
    document.addEventListener('DOMContentLoaded', function () {
        document.addEventListener('click', function (event) {
            const trigger = event.target.closest('.btn-delete');
            if (!trigger) return;

            event.preventDefault();
            const url = trigger.dataset.url;

            Swal.fire({
                title: 'Delete Deal?',
                text: 'Are you sure you want to delete this deal package?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc2626',
                confirmButtonText: 'Yes, delete deal',
                cancelButtonText: 'Cancel',
                reverseButtons: true,
            }).then((result) => {
                if (!result.isConfirmed) return;

                fetch(url, {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': '{{ csrf_token() }}',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ _method: 'DELETE' })
                })
                .then(response => response.json())
                .then((res) => {
                    if (res.success) {
                        trigger.closest('tr').remove();
                        Swal.fire('Deleted!', 'Deal has been removed successfully.', 'success');
                    }
                });
            });
        });
    });
</script>
@endsection
