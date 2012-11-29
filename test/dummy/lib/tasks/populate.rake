namespace :db do
  desc "Fill database with sample data"
  task :populate => :environment do
    Rake::Task['db:reset'].invoke
    create_users
  end

  def create_users
    100.times do
      u = User.create(:value => rand(99))
      u.created_at = Time.now - rand(999).hours
      u.updated_at = Time.now - rand(999).hours
      u.save
    end
  end
end