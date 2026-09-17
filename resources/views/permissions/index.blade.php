@extends('layouts.admin')

@section('title', 'Permissions')
@section('content-header', 'Permissions')

@section('content')
@foreach($permissions->groupBy('group_name') as $group => $groupPerms)
<div class="card mb-3">
    <div class="card-header" style="display:flex;align-items:center;gap:8px;">
        <span style="width:8px;height:8px;border-radius:50%;background:#0ea5b0;display:inline-block;"></span>
        <span style="text-transform:capitalize;font-weight:600;">{{ $group ?? 'General' }}</span>
        <span class="badge badge-primary ml-1">{{ $groupPerms->count() }}</span>
    </div>
    <div class="card-body" style="padding:14px 18px;">
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
            @foreach($groupPerms as $permission)
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:6px 14px;">
                <span style="font-size:0.8rem;font-weight:600;color:#0ea5b0;">{{ $permission->name }}</span>
                @if($permission->description)
                    <span style="font-size:0.75rem;color:#9ca3af;margin-left:6px;">— {{ $permission->description }}</span>
                @endif
            </div>
            @endforeach
        </div>
    </div>
</div>
@endforeach
@endsection
