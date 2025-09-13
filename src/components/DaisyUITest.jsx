import React from 'react';

export function DaisyUITest() {
  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold mb-4">DaisyUI Components Test</h2>
      
      {/* Button Components */}
      <div className="space-x-2">
        <button className="btn">Default Button</button>
        <button className="btn btn-primary">Primary Button</button>
        <button className="btn btn-secondary">Secondary Button</button>
        <button className="btn btn-accent">Accent Button</button>
      </div>

      {/* Card Component */}
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">DaisyUI Card</h2>
          <p>This is a test card to verify DaisyUI is working properly.</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Action</button>
          </div>
        </div>
      </div>

      {/* Alert Component */}
      <div className="alert alert-success">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>DaisyUI is working correctly!</span>
      </div>

      {/* Badge Components */}
      <div className="space-x-2">
        <div className="badge">Default Badge</div>
        <div className="badge badge-primary">Primary Badge</div>
        <div className="badge badge-secondary">Secondary Badge</div>
        <div className="badge badge-accent">Accent Badge</div>
      </div>

      {/* Progress Component */}
      <progress className="progress progress-primary w-56" value="70" max="100"></progress>

      {/* Toggle Component */}
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">DaisyUI Toggle</span>
          <input type="checkbox" className="toggle toggle-primary" defaultChecked />
        </label>
      </div>
    </div>
  );
}
