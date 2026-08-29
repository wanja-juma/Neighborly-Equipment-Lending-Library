import { useState } from 'react';

function Report() {
  const [form, setForm] = useState({ toolName: '', issueType: 'damaged', description: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="static-page">
        <h1>Report an Issue or Tool</h1>
        <p>Thanks! Your report about "{form.toolName}" has been received.</p>
      </section>
    );
  }

  return (
    <section className="static-page">
      <h1>Report an Issue or Tool</h1>
      <p>
        If you've encountered a problem with a tool, a borrowing request, or
        another user, let us know so we can help resolve it.
      </p>
      <form onSubmit={handleSubmit} className="static-form">
        <label htmlFor="toolName">Tool or item name</label>
        <input
          id="toolName"
          name="toolName"
          type="text"
          value={form.toolName}
          onChange={handleChange}
          required
        />

        <label htmlFor="issueType">Issue type</label>
        <select
          id="issueType"
          name="issueType"
          value={form.issueType}
          onChange={handleChange}
        >
          <option value="damaged">Damaged item</option>
          <option value="not-returned">Item not returned</option>
          <option value="user-behavior">User behavior</option>
          <option value="other">Other</option>
        </select>

        <label htmlFor="description">Describe the issue</label>
        <textarea
          id="description"
          name="description"
          rows="5"
          value={form.description}
          onChange={handleChange}
          required
        />

        <button type="submit">Submit Report</button>
      </form>
    </section>
  );
}

export default Report;
