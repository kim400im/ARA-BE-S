const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

exports.saveChatHistory = async ({ message, role }) => {
  const { error } = await supabase
    .from('chat_history')
    .insert([{ message, role }]);
  if (error) {
    console.error('Supabase Error:', error.message);
    throw new Error('Failed to save chat history.');
  }
};
