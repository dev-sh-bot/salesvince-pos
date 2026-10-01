@extends('layouts.admin')

@section('title', __('order.title'))

@section('content')
    <div id="cart"></div>
    <!--cart></cart-->

@endsection

@section('css')
<style>
    .content-wrapper.snd-content-wrapper {
        height: calc(100vh - var(--snd-topbar-height) - var(--snd-utility-height)) !important;
        min-height: calc(100vh - var(--snd-topbar-height) - var(--snd-utility-height)) !important;
        overflow: hidden !important;
        padding-bottom: 0 !important;
        background: var(--snd-workspace) !important;
    }
    .content-header.snd-content-header,
    .main-footer { display: none !important; }
    .pos-shell { height: 100% !important; min-height: 0 !important; display: flex; }
    .pos-panel { height: 100%; flex: 1; }
    .content.snd-content {
        height: 100% !important;
        max-height: 100% !important;
        overflow: hidden !important;
        margin: 0 !important;
        padding: 0 !important;
    }
    #cart { width: 100%; height: 100%; }
</style>
@endsection
