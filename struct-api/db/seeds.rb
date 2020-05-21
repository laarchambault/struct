require 'faker'
# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

15.times do 
    person = User.create(
        f_name: Faker::Name.first_name,
        l_name: Faker::Name.last_name,
        password: Faker::Internet.password,
        email: Faker::Internet.safe_email,
        phone: Faker::PhoneNumber.cell_phone,
        company: Faker::Company.name,
        company_phone: Faker::PhoneNumber.phone_number,
        company_email: Faker::Internet.safe_email
    )

end

5.times do
    Job.create(name: Faker::Company.name)
end

10.times do
    UserJob.create(user_id: User.all.sample.id, job_id: Job.all.sample.id)
end

15.times do
    Project.create(name: Faker::Company.name, job_id: Job.all.sample.id)
end

15.times do
    UserProject.create(user_id: User.all.sample.id, project_id: Project.all.sample.id)
end



