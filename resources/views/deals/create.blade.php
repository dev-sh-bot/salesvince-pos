@extends('layouts.admin')

@section('title', 'Create New Deal')
@section('content-header', 'Create New Deal')

@section('css')
<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
<style>
/* Custom Select2 Luxury Styling */
.select2-container--default .select2-selection--multiple {
    border: 1.5px solid var(--snd-border-strong) !important;
    border-radius: 12px !important;
    padding: 6px 10px !important;
    min-height: 52px !important;
    background: var(--snd-surface-solid) !important;
    box-shadow: 0 1px 3px rgba(0,0,0,0.02) !important;
}
.select2-container--default.select2-container--focus .select2-selection--multiple {
    border-color: var(--snd-primary) !important;
    box-shadow: 0 0 0 3px var(--snd-primary-ring) !important;
}
.select2-container--default .select2-selection--multiple .select2-selection__choice {
    background: linear-gradient(135deg, var(--snd-primary) 0%, var(--snd-primary-deep) 100%) !important;
    border: none !important;
    color: #ffffff !important;
    font-weight: 700 !important;
    font-size: 0.83rem !important;
    border-radius: 8px !important;
    padding: 4px 10px 4px 24px !important;
    position: relative !important;
    margin-top: 4px !important;
    margin-right: 6px !important;
    box-shadow: 0 2px 6px rgba(151, 134, 238, 0.25) !important;
}
.select2-container--default .select2-selection--multiple .select2-selection__choice__remove {
    color: #ffffff !important;
    left: 6px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    border-right: none !important;
    font-weight: bold !important;
    font-size: 0.95rem !important;
}
.select2-container--default .select2-selection--multiple .select2-selection__choice__remove:hover {
    background: transparent !important;
    color: #fca5a5 !important;
}
.select2-dropdown {
    border: 1.5px solid var(--snd-border-strong) !important;
    border-radius: 14px !important;
    box-shadow: 0 10px 25px rgba(15,23,42,0.12) !important;
    overflow: hidden !important;
}
.select2-results__group {
    background: var(--snd-primary-soft) !important;
    color: var(--snd-ink) !important;
    font-weight: 800 !important;
    font-size: 0.84rem !important;
    padding: 8px 12px !important;
}
.select2-results__option {
    padding: 9px 14px !important;
    font-size: 0.88rem !important;
    font-weight: 600 !important;
}
.select2-container--default .select2-results__option--highlighted[aria-selected] {
    background-color: var(--snd-primary) !important;
    color: #ffffff !important;
}

/* Pricing Summary Card (Right Column) */
.price-summary-card {
    background: var(--snd-surface);
    border-radius: var(--snd-radius-lg);
    border: 1px solid var(--snd-border);
    padding: 22px 24px;
    box-shadow: var(--snd-shadow);
}
.price-summary-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--snd-border);
    margin-bottom: 18px;
}
.price-summary-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--snd-primary) 0%, var(--snd-primary-deep) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 1.1rem;
    box-shadow: 0 4px 12px rgba(151, 134, 238, 0.3);
}
.field-label {
    font-size: 0.86rem;
    font-weight: 700;
    color: var(--snd-ink-soft);
    margin-bottom: 6px;
    display: block;
}
.savings-box {
    background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
    border: 1.5px solid #a7f3d0;
    border-radius: 14px;
    padding: 14px 16px;
    margin-bottom: 18px;
}
</style>
@endsection

@section('content')
<form action="{{ route('deals.store') }}" method="POST" id="deal-form">
    @csrf
    <div class="row">
        {{-- Left Column: Basic Details & Service Select Dropdown --}}
        <div class="col-lg-8">
            <div class="card" style="border-radius: 18px; border: 1.5px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
                <div class="card-header bg-white border-0 pt-4 px-4 pb-0">
                    <h5 class="font-weight-bold text-dark mb-1"><i class="fas fa-tags text-primary mr-2"></i>Deal Package Information</h5>
                    <p class="text-muted small">Enter deal package details and select included services from the dropdown.</p>
                </div>
                <div class="card-body p-4">
                    @if ($errors->any())
                        <div class="alert alert-danger" style="border-radius: 12px;">
                            <ul class="mb-0">
                                @foreach ($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif

                    <div class="row">
                        <div class="col-md-7">
                            <div class="form-group mb-3">
                                <label class="field-label">Deal Package Name <span class="text-danger">*</span></label>
                                <input type="text" name="name" class="form-control" placeholder="e.g. Party Makeup + Hair Styling Deal" value="{{ old('name') }}" required style="border-radius: 10px; height: 44px; font-weight: 600;">
                            </div>
                        </div>
                        <div class="col-md-5">
                            <div class="form-group mb-3">
                                <label class="field-label">Barcode / Code <small class="text-muted">(Optional)</small></label>
                                <input type="text" name="barcode" class="form-control" placeholder="Auto-generated if empty" value="{{ old('barcode') }}" style="border-radius: 10px; height: 44px;">
                            </div>
                        </div>
                    </div>

                    <div class="form-group mb-4">
                        <label class="field-label">Description / Details</label>
                        <textarea name="description" class="form-control" rows="3" placeholder="Briefly describe what's included in this deal..." style="border-radius: 10px;">{{ old('description') }}</textarea>
                    </div>

                    {{-- Select2 Multi-Select Dropdown Section --}}
                    <div class="form-group mb-4">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <label class="field-label mb-0" style="font-size: 0.92rem;">Select Included Services <span class="text-danger">*</span></label>
                            <span class="badge badge-primary px-3 py-2" id="selected-services-count" style="border-radius: 12px; font-size: 0.78rem; font-weight: 800;">0 Services Selected</span>
                        </div>

                        <select name="services[]" id="services-select" class="form-control select2" multiple="multiple" data-placeholder="Search and select services..." required style="width: 100%;">
                            @foreach($categories as $category)
                                @if($category->services->count() > 0)
                                    <optgroup label="📂 {{ $category->name }}">
                                        @foreach($category->services as $service)
                                            <option value="{{ $service->id }}" data-rate="{{ $service->rate }}" {{ is_array(old('services')) && in_array($service->id, old('services')) ? 'selected' : '' }}>
                                                {{ $service->name }} — {{ config('settings.currency_symbol') }} {{ number_format($service->rate, 2) }}
                                            </option>
                                        @endforeach
                                    </optgroup>
                                @endif
                            @endforeach

                            @if($uncategorizedServices->count() > 0)
                                <optgroup label="🌸 Other Services">
                                    @foreach($uncategorizedServices as $service)
                                        <option value="{{ $service->id }}" data-rate="{{ $service->rate }}" {{ is_array(old('services')) && in_array($service->id, old('services')) ? 'selected' : '' }}>
                                            {{ $service->name }} — {{ config('settings.currency_symbol') }} {{ number_format($service->rate, 2) }}
                                        </option>
                                    @endforeach
                                </optgroup>
                            @endif
                        </select>
                        <small class="text-muted mt-2 d-block"><i class="fas fa-info-circle mr-1 text-primary"></i>Click or search to select multiple services. Prices will auto-sum in real-time.</small>
                    </div>
                </div>
            </div>
        </div>

        {{-- Right Column: Modern High-Contrast Pricing Card --}}
        <div class="col-lg-4">
            <div class="price-summary-card mb-4">
                <div class="price-summary-header">
                    <div class="price-summary-icon">
                        <i class="fas fa-calculator"></i>
                    </div>
                    <div>
                        <h6 class="font-weight-extrabold text-dark mb-0" style="font-size: 1.05rem;">Deal Pricing & Savings</h6>
                        <small class="text-muted">Set original total & deal discount price</small>
                    </div>
                </div>

                {{-- Before Amount (Original Total) --}}
                <div class="form-group mb-3">
                    <label class="field-label">Before Amount (Original Total)</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                        <span class="input-group-text font-weight-bold border-right-0" style="background: var(--snd-primary-soft); color: var(--snd-primary-deep); border-radius: 10px 0 0 10px;">{{ config('settings.currency_symbol') }}</span>
                        </div>
                        <input type="number" step="0.01" min="0" name="original_amount" id="original_amount" class="form-control font-weight-bold text-dark" value="{{ old('original_amount', '0.00') }}" required style="border-radius: 0 10px 10px 0; font-size: 1.15rem; height: 46px; background: var(--snd-surface-solid);">
                    </div>
                    <small class="text-muted mt-1 d-block"><i class="fas fa-magic text-primary mr-1"></i>Auto-summed from selected services.</small>
                </div>

                {{-- After Discount (Deal Price) --}}
                <div class="form-group mb-3">
                    <label class="field-label text-primary" style="font-size: 0.9rem;">After Discount (Deal Price) <span class="text-danger">*</span></label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text font-weight-bold text-white border-right-0" style="background: var(--snd-primary); border-radius: 10px 0 0 10px;">{{ config('settings.currency_symbol') }}</span>
                        </div>
                        <input type="number" step="0.01" min="0" name="discounted_amount" id="discounted_amount" class="form-control font-weight-extrabold text-primary" value="{{ old('discounted_amount', '0.00') }}" required style="border-radius: 0 10px 10px 0; font-size: 1.3rem; height: 48px; border: 2px solid var(--snd-primary); background: #fff;">
                    </div>
                </div>

                {{-- Live Savings Box --}}
                <div class="savings-box">
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="font-weight-bold text-dark small">Discount Percentage:</span>
                <span class="badge badge-success px-3 py-1 font-weight-bold" id="live-discount-percent" style="font-size: 0.95rem; border-radius: 10px;">0% OFF</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-2 pt-2" style="border-top: 1px dashed #a7f3d0;">
                        <span class="small font-weight-bold text-muted">Total Customer Savings:</span>
                        <span class="font-weight-bold text-success" id="live-discount-savings" style="font-size: 0.95rem;">{{ config('settings.currency_symbol') }} 0.00</span>
                    </div>
                </div>

                {{-- Active Status Switch --}}
                <div class="form-group mb-4 p-3" style="background: var(--snd-surface-soft); border-radius: 12px; border: 1px solid var(--snd-border);">
                    <div class="custom-control custom-switch">
                        <input type="checkbox" name="status" value="1" class="custom-control-input" id="status-switch" {{ old('status', '1') == '1' ? 'checked' : '' }}>
                        <label class="custom-control-label font-weight-bold text-dark" for="status-switch" style="cursor:pointer; font-size: 0.9rem;">
                            Active Deal Package
                        </label>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary btn-block font-weight-bold py-3" style="border: none; border-radius: 12px; font-size: 1rem;">
                    <i class="fas fa-save mr-2"></i> Save Deal Package
                </button>
                <a href="{{ route('deals.index') }}" class="btn btn-outline-secondary btn-block mt-2 font-weight-bold py-2" style="border-radius: 12px;">
                    Cancel
                </a>
            </div>
        </div>
    </div>
</form>
@endsection

@section('js')
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
<script>
    function updateDealCalculations() {
        const select = document.getElementById('services-select');
        let totalOriginal = 0;
        let selectedCount = 0;

        if (select) {
            Array.from(select.selectedOptions).forEach(opt => {
                totalOriginal += parseFloat(opt.dataset.rate || 0);
                selectedCount++;
            });
        }

        const countBadge = document.getElementById('selected-services-count');
        if (countBadge) countBadge.innerText = `${selectedCount} Services Selected`;

        const originalInput = document.getElementById('original_amount');
        if (originalInput) originalInput.value = totalOriginal.toFixed(2);

        calculateDiscount();
    }

    function calculateDiscount() {
        const original = parseFloat(document.getElementById('original_amount').value || 0);
        const discounted = parseFloat(document.getElementById('discounted_amount').value || 0);

        let percent = 0;
        let savings = 0;

        if (original > 0 && discounted < original) {
            savings = original - discounted;
            percent = (savings / original) * 100;
        }

        const percentBadge = document.getElementById('live-discount-percent');
        if (percentBadge) percentBadge.innerText = `${percent.toFixed(0)}% OFF`;

        const savingsSpan = document.getElementById('live-discount-savings');
        if (savingsSpan) savingsSpan.innerText = `{{ config('settings.currency_symbol') }} ${savings.toFixed(2)}`;
    }

    document.addEventListener('DOMContentLoaded', function () {
        if (window.$ && $.fn.select2) {
            $('#services-select').select2({
                placeholder: "Search and select services...",
                allowClear: true,
                width: '100%'
            }).on('change', function () {
                updateDealCalculations();
            });
        }

        document.getElementById('original_amount').addEventListener('input', calculateDiscount);
        document.getElementById('discounted_amount').addEventListener('input', calculateDiscount);

        updateDealCalculations();
    });
</script>
@endsection
