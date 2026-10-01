@extends('layouts.admin')

@section('title', 'Create Category')
@section('content-header', 'Create Category')

@section('content')
<div class="card">
    <div class="card-body">
        <form action="{{ route('categories.store') }}" method="POST">
            @csrf

            <div class="form-group">
                <label for="name">Category Name</label>
                <input type="text" name="name" class="form-control @error('name') is-invalid @enderror" id="name" value="{{ old('name') }}">
                @error('name')<span class="invalid-feedback"><strong>{{ $message }}</strong></span>@enderror
            </div>

            <div class="form-group">
                <label for="slug">Slug</label>
                <input type="text" name="slug" class="form-control @error('slug') is-invalid @enderror" id="slug" value="{{ old('slug') }}" placeholder="Optional, auto-generated from name">
                @error('slug')<span class="invalid-feedback"><strong>{{ $message }}</strong></span>@enderror
            </div>

            <div class="form-group">
                <label for="description">Description</label>
                <textarea name="description" class="form-control @error('description') is-invalid @enderror" id="description">{{ old('description') }}</textarea>
                @error('description')<span class="invalid-feedback"><strong>{{ $message }}</strong></span>@enderror
            </div>

            <div class="form-group">
                <label for="sort_order">Sort Order</label>
                <input type="number" min="0" name="sort_order" class="form-control @error('sort_order') is-invalid @enderror" id="sort_order" value="{{ old('sort_order', 0) }}">
                @error('sort_order')<span class="invalid-feedback"><strong>{{ $message }}</strong></span>@enderror
            </div>

            <div class="form-group">
                <label for="status">Status</label>
                <select name="status" class="form-control @error('status') is-invalid @enderror" id="status">
                    <option value="1" {{ old('status') === 1 || old('status') === '1' ? 'selected' : '' }}>Active</option>
                    <option value="0" {{ old('status') === 0 || old('status') === '0' ? 'selected' : '' }}>Inactive</option>
                </select>
                @error('status')<span class="invalid-feedback"><strong>{{ $message }}</strong></span>@enderror
            </div>

            <button class="btn btn-primary" type="submit">Create Category</button>
        </form>
    </div>
</div>
@endsection
